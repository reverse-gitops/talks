# -*- coding: iso-8859-15 -*-

"""Websocket handling class."""

import logging
import tornado.escape
import tornado.websocket

LOGGER = logging.getLogger(__name__)


class MainSocket(tornado.websocket.WebSocketHandler):
    """Handles long polling communication between xterm.js and server."""

    def check_origin(self, origin):
        return True
        
    def initialize(self, close_future=None):
        """Base class initialization."""
        self.close_future = close_future

    def open(self, pid):
        """Open a Websocket associated to a console."""
        LOGGER.info("WebSocket opened: {0}".format(pid))
        self.pid = pid
        attached = self.application.term_manager.start_term(pid, self)
        if not attached:
            LOGGER.warning("Rejecting websocket for unknown pid=%s", pid)
            self.close(code=4404, reason='terminal-not-found')
            return

        term = self.application.term_manager.consoles.get(pid)
        if term is not None and term._output_buffer:
            self.write_message(term._output_buffer)

        LOGGER.info("TTY On!")

    def on_preclose(self):
        """Close console communication."""
        LOGGER.info('Wassup!')

    def on_close(self):
        """Close console communication."""
        LOGGER.info('TTY Off!')
        LOGGER.info("WebSocket closed: {0}".format(getattr(self, 'pid', '<unknown>')))
        if hasattr(self, 'pid'):
            self.application.term_manager.client_disconnected(self.pid, self)
        if self.close_future is not None and not self.close_future.done():
            self.close_future.set_result(("Done!"))

    def on_message(self, message):
        """Execute a command on console."""
        if not hasattr(self, 'pid') or not self.application.term_manager.has_term(self.pid):
            LOGGER.warning("Dropping message for unknown pid=%s", getattr(self, 'pid', '<unknown>'))
            self.close(code=4404, reason='terminal-not-found')
            return
        self.application.term_manager.execute(self.pid, message)

    def on_pty_read(self, text):
        """Read data from pty; accumulate in buffer and send to frontend."""
        self.write_message(text)

    def on_pty_died(self):
        """Close websocket if terminal was closed externally."""
        pid = getattr(self, 'pid', None)
        if pid is not None:
            self.application.term_manager.delete_term(pid)
        self.close()
