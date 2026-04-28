# -*- coding: utf-8 -*-

"""Term manager."""
import inspect
import os
import signal
import hashlib
import time
from dataclasses import dataclass
from datetime import datetime, timezone

import tornado.web
from tornado.ioloop import IOLoop
from terminado.management import TermManagerBase, PtyWithClients
from urllib.parse import unquote

import logging
LOGGER = logging.getLogger(__name__)

WINDOWS = os.name == 'nt'


_CLEAR_SEQUENCES = ('\x1b[2J', '\x1b[3J')
_BUFFER_MAX_CHARS = 512 * 1024


@dataclass
class SessionRecord:
    """In-memory PTY session state."""

    pid: str
    term: PtyWithClients
    expiry_handle: object = None


class PtyReader(PtyWithClients):
    """Wrapper around PtyWithClients."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._output_buffer = ''

    def append_to_buffer(self, text):
        """Accumulate PTY output; reset on screen-clear sequences."""
        last_clear = -1
        for seq in _CLEAR_SEQUENCES:
            pos = text.rfind(seq)
            if pos >= 0 and pos > last_clear:
                last_clear = pos

        if last_clear >= 0:
            text = text[last_clear:]
            self._output_buffer = ''

        self._output_buffer += text
        if len(self._output_buffer) > _BUFFER_MAX_CHARS:
            self._output_buffer = self._output_buffer[-_BUFFER_MAX_CHARS:]

    def resize_to_smallest(self, rows, cols):
        """Set the terminal size to that of the smallest client dimensions.

        A terminal not using the full space available is much nicer than a
        terminal trying to use more than the available space, so we keep it
        sized to the smallest client.
        """
        minrows = mincols = 10001
        if rows is not None and rows < minrows:
            minrows = rows
        if cols is not None and cols < mincols:
            mincols = cols

        if minrows == 10001 or mincols == 10001:
            return

        rows, cols = self.ptyproc.getwinsize()
        if (rows, cols) != (minrows, mincols):
            LOGGER.debug("Resizing PTY to {0}x{1}".format(mincols, minrows))
            self.ptyproc.setwinsize(minrows, mincols)


class TermManager(TermManagerBase):
    """Wrapper around pexpect to execute local commands."""

    def __init__(self, shell_command, disconnect_grace_ms=30000, ioloop=None, **kwargs):
        """Create a new terminal handler instance."""
        super().__init__(shell_command, **kwargs)
        self.consoles = {}
        self.sessions = {}
        self.disconnect_grace_ms = max(0, int(disconnect_grace_ms))
        self.ioloop = ioloop or IOLoop.current()

        if 0 < self.disconnect_grace_ms < 5000:
            LOGGER.warning(
                "PTY disconnect grace period is set below the recommended minimum: %sms",
                self.disconnect_grace_ms,
            )

    def _get_session(self, pid):
        """Return the session record for a PID, if it exists."""
        return self.sessions.get(pid)

    def _get_pty_pid(self, term):
        """Return the child PTY process identifier, if available."""
        return getattr(getattr(term, 'ptyproc', None), 'pid', None)

    def _log_event(self, event, pid, term=None, grace_ms=None):
        """Emit structured PTY lifecycle logs."""
        if term is None:
            session = self._get_session(pid)
            term = None if session is None else session.term

        LOGGER.info(
            "%s session_id=%s pty_pid=%s attached_client_count=%s grace_ms=%s timestamp=%s",
            event,
            pid,
            self._get_pty_pid(term) if term is not None else None,
            len(term.clients) if term is not None else 0,
            self.disconnect_grace_ms if grace_ms is None else grace_ms,
            datetime.now(timezone.utc).isoformat(),
        )

    def _cancel_expiry(self, pid):
        """Cancel a pending PTY expiry timer."""
        session = self._get_session(pid)
        if session is None or session.expiry_handle is None:
            return False

        handle = session.expiry_handle
        session.expiry_handle = None
        if hasattr(handle, 'cancel'):
            handle.cancel()
        else:
            self.ioloop.remove_timeout(handle)
        self._log_event('pty.grace_cancelled', pid, term=session.term)
        return True

    def _schedule_expiry(self, pid):
        """Start or restart the PTY disconnect grace timer."""
        session = self._get_session(pid)
        if session is None:
            return

        self._cancel_expiry(pid)
        delay_s = self.disconnect_grace_ms / 1000.0
        session.expiry_handle = self.ioloop.call_later(delay_s, self._expire_session, pid)
        self._log_event('pty.grace_scheduled', pid, term=session.term)

    def _expire_session(self, pid):
        """Expire an idle PTY after its grace period elapses."""
        session = self._get_session(pid)
        if session is None:
            return

        session.expiry_handle = None
        if session.term.clients:
            LOGGER.debug("Skipping expiry for pid=%s because clients reattached", pid)
            return

        self._log_event('pty.expired', pid, term=session.term)
        self._terminate_session(pid)

    def _stop_tracking_term(self, term):
        """Detach a PTY from the IOLoop reader registry."""
        fd = getattr(getattr(term, 'ptyproc', None), 'fd', None)
        if fd is None:
            return

        self.ptys_by_fd.pop(fd, None)
        try:
            self.ioloop.remove_handler(fd)
        except Exception:
            pass

    def _remove_session(self, pid):
        """Remove a PTY session from the in-memory registries."""
        session = self._get_session(pid)
        if session is None:
            self.consoles.pop(pid, None)
            return None

        self._cancel_expiry(pid)
        self.sessions.pop(pid, None)
        self.consoles.pop(pid, None)
        return session

    def _terminate_session(self, pid):
        """Terminate a PTY and remove all in-memory session state."""
        session = self._remove_session(pid)
        if session is None:
            return False

        term = session.term
        self._stop_tracking_term(term)

        for client in list(term.clients):
            try:
                client.close()
            except Exception:
                LOGGER.debug("Failed to close websocket for pid=%s", pid, exc_info=True)

        try:
            if WINDOWS:
                term.kill()
                self.pty_read(term.ptyproc.fd)
            else:
                term.killpg(signal.SIGHUP)
        except Exception:
            LOGGER.debug("Failed to terminate PTY pid=%s cleanly", pid, exc_info=True)

        self._log_event('pty.terminated', pid, term=term)
        return True

    def new_terminal(self, **kwargs):
        """Make a new terminal, return a :class:`PtyReader` instance."""
        options = self.term_settings.copy()
        options['shell_command'] = self.shell_command
        options.update(kwargs)
        argv = options['shell_command']

        # Ensure argv is a list for terminado/ptyprocess
        if isinstance(argv, str):
            argv = [argv]
        elif isinstance(argv, list):
            # Flatten nested lists
            flat_argv = []
            for item in argv:
                if isinstance(item, list):
                    flat_argv.extend(str(i) for i in item)
                else:
                    flat_argv.append(str(item))
            argv = flat_argv

        env = self.make_term_env(**options)
        cwd = options.get('cwd', None)
        LOGGER.debug("Spawning new terminal: {0} in {1}".format(argv, cwd))
        return PtyReader(argv, env, cwd)

    def has_term(self, pid):
        """Return True if a PTY exists for the given pid."""
        return pid in self.sessions

    def pty_read(self, fd, events=None):
        """Read PTY output and retain it even while no clients are attached."""
        term = self.ptys_by_fd.get(fd)
        if term is None:
            return

        try:
            text = term.ptyproc.read(65536)
        except EOFError:
            self.on_eof(term)
            return
        except Exception:
            LOGGER.exception("Unexpected error while reading PTY output")
            self.on_eof(term)
            return

        if not text:
            return

        term.append_to_buffer(text)
        for client in list(term.clients):
            client.on_pty_read(text)

    def on_eof(self, ptywclients):
        """Clean up state when the PTY exits on its own."""
        pid = None
        for candidate_pid, session in self.sessions.items():
            if session.term is ptywclients:
                pid = candidate_pid
                break

        if pid is not None:
            session = self._remove_session(pid)
            if session is not None:
                self._log_event('pty.terminated', pid, term=session.term)

        on_eof = getattr(super(), 'on_eof', None)
        if on_eof is not None:
            on_eof(ptywclients)

    def client_disconnected(self, pid, socket):
        """Handle websocket disconnect and start PTY expiry on last client."""
        session = self._get_session(pid)
        if session is None:
            LOGGER.debug("client_disconnected called for unknown pid=%s", pid)
            return

        term = session.term
        if socket in term.clients:
            term.clients.remove(socket)
        else:
            LOGGER.debug("client_disconnected called with non-member socket for pid=%s", pid)

        self._log_event('ws.detached', pid, term=term)
        if term.clients:
            LOGGER.debug("Keeping terminal pid=%s alive, remaining clients=%s", pid, len(term.clients))
            return

        self._schedule_expiry(pid)

    def create_term(self, rows, cols, cwd=None):
        """Create a new virtual terminal."""
        LOGGER.debug("create_term called with rows={0}, cols={1}, cwd={2}".format(rows, cols, cwd))
        pid = hashlib.md5(str(time.time()).encode('utf-8')).hexdigest()[0:6]
        # We need to do percent decoding for reading the cwd through a cookie
        # For further information see spyder-ide/spyder-terminal#225
        cwd = unquote(cwd)
        LOGGER.debug("Decoded CWD: {0}".format(cwd))
        
        try:
            pty = self.new_terminal(cwd=cwd, height=rows, width=cols)
            pty.resize_to_smallest(rows, cols)
            self.consoles[pid] = pty
            self.sessions[pid] = SessionRecord(pid=pid, term=pty)
            LOGGER.info("Terminal created with PID {0} for CWD {1}".format(pid, cwd))
            self._log_event('pty.created', pid, term=pty)
            return pid
        except Exception as e:
            LOGGER.error("Error in TermManager.create_term: {0}".format(str(e)), exc_info=True)
            raise

    def start_term(self, pid, socket):
        """Attach a websocket client to a virtual terminal."""
        session = self._get_session(pid)
        if session is None:
            LOGGER.warning("start_term called for unknown pid=%s", pid)
            self._log_event('ws.attach_rejected', pid)
            return False

        term = session.term
        self._cancel_expiry(pid)
        if socket in term.clients:
            LOGGER.debug("Socket already attached to pid=%s", pid)
            return True

        should_start_reader = getattr(term.ptyproc, 'fd', None) not in self.ptys_by_fd
        term.clients.append(socket)
        if should_start_reader:
            self.start_reading(term)
            LOGGER.debug("Started PTY reader for pid=%s", pid)
        else:
            LOGGER.debug("Reused existing PTY reader for pid=%s, clients=%s", pid, len(term.clients))
        self._log_event('ws.attached', pid, term=term)
        return True

    def execute(self, pid, cmd):
        """Write characters to terminal."""
        session = self._get_session(pid)
        if session is None:
            LOGGER.warning("execute called for unknown pid=%s", pid)
            return
        session.term.ptyproc.write(cmd)

    def resize_term(self, pid, rows, cols):
        """Resize terminal."""
        session = self._get_session(pid)
        if session is None:
            LOGGER.warning("resize_term called for unknown pid=%s", pid)
            return False
        session.term.resize_to_smallest(rows, cols)
        return True

    def delete_term(self, pid):
        """Delete a PTY immediately."""
        deleted = self._terminate_session(pid)
        if not deleted:
            LOGGER.debug("delete_term called for unknown pid=%s", pid)
        return deleted

    async def shutdown(self):
        """Terminate all PTY sessions and delegate to the base shutdown."""
        for pid in list(self.sessions):
            self.delete_term(pid)

        shutdown = getattr(super(), 'shutdown', None)
        if shutdown is None:
            return

        result = shutdown()
        if inspect.isawaitable(result):
            await result
