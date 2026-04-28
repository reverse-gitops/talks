
"""
Tornado server-side tests.

Note: This uses tornado.testing unittest style tests
"""

import os
import sys
import os.path as osp
from urllib.parse import urlencode


import pytest
from flaky import flaky
from tornado import testing, websocket, gen
from tornado.concurrent import Future

sys.path.append(osp.realpath(osp.dirname(__file__) + "/.."))

from spyder_terminal.server.common import create_app

LOCATION = os.path.realpath(os.path.join(os.getcwd(),
                                         os.path.dirname(__file__)))
LOCATION_SLASH = LOCATION.replace('\\', '/')

LINE_END = '\n'
SHELL = 'bash'
WINDOWS = os.name == 'nt'

if WINDOWS:
    LINE_END = '\r\n'
    SHELL = 'cmd'


class TerminalServerTests(testing.AsyncHTTPTestCase):
    """Main server tests."""

    disconnect_grace_ms = 1000

    def get_app(self):
        """Return HTTP/WS server."""
        self.close_future = Future()
        return create_app(
            SHELL,
            self.close_future,
            pty_disconnect_grace_ms=self.disconnect_grace_ms,
        )

    def _mk_connection(self, pid):
        return websocket.websocket_connect(
            'ws://127.0.0.1:{0}/terminals/{1}'.format(
                self.get_http_port(), pid)
        )

    @gen.coroutine
    def read_until(self, ws, expected, max_reads=80):
        """Read websocket output until the expected token is observed."""
        message = ''
        for _ in range(max_reads):
            chunk = yield ws.read_message()
            if chunk is None:
                break
            message += chunk
            if expected in message:
                break
        return message

    @gen.coroutine
    def close(self, ws):
        """
        Close a websocket connection and wait for the server side.

        If we don't wait here, there are sometimes leak warnings in the
        tests.
        """
        ws.close()
        yield self.close_future

    @testing.gen_test
    def test_main_get(self):
        """Test if HTML source is rendered."""
        response = yield self.http_client.fetch(
            self.get_url('/'),
            method="GET"
        )
        self.assertEqual(response.code, 200)

    @testing.gen_test
    def test_main_post(self):
        """Test that POST requests to root are forbidden."""
        try:
            yield self.http_client.fetch(
                self.get_url('/'),
                method="POST",
                body=''
            )
        except Exception:
            pass

    @testing.gen_test
    def test_create_terminal(self):
        """Test terminal creation."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        self.assertEqual(response.code, 200)

    @flaky(max_runs=3)
    @testing.gen_test
    def test_terminal_communication(self):
        """Test terminal creation."""
        data = {'rows': '25', 'cols': '100'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        pid = response.body.decode('utf-8')
        sock = yield self._mk_connection(pid)
        msg = yield sock.read_message()
        print(msg)
        test_msg = 'pwd'
        sock.write_message(' ' + test_msg)
        msg = ''
        while test_msg not in msg:
            msg += yield sock.read_message()
            print(msg)
            msg = ''.join(msg.rstrip())
        self.assertTrue(test_msg in msg)
        yield self.close(sock)

    @testing.gen_test
    def test_terminal_closing(self):
        """Test terminal destruction."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        pid = response.body.decode('utf-8')
        sock = yield self._mk_connection(pid)
        _ = yield sock.read_message()
        yield self.close(sock)
        try:
            sock.write_message(' This shall not work')
        except AttributeError:
            pass
        yield self.close(sock)

    @flaky(max_runs=3)
    @testing.gen_test
    def test_terminal_multi_client_shared_session(self):
        """Two websocket clients can attach to the same terminal PID."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        pid = response.body.decode('utf-8')

        sock1 = yield self._mk_connection(pid)
        _ = yield sock1.read_message()
        sock2 = yield self._mk_connection(pid)

        first_token = 'multi-client-ok'
        sock1.write_message('echo {0}{1}'.format(first_token, LINE_END))
        msg = ''
        for _ in range(80):
            chunk = yield sock2.read_message()
            if chunk is None:
                break
            msg += chunk
            if first_token in msg:
                break
        self.assertIn(first_token, msg)

        # Closing one client must not kill the shared PTY while another remains.
        sock1.close()
        yield gen.sleep(0.1)

        second_token = 'still-alive'
        sock2.write_message('echo {0}{1}'.format(second_token, LINE_END))
        msg = ''
        for _ in range(80):
            chunk = yield sock2.read_message()
            if chunk is None:
                break
            msg += chunk
            if second_token in msg:
                break
        self.assertIn(second_token, msg)
        yield self.close(sock2)

    @flaky(max_runs=3)
    @pytest.mark.timeout(10)
    @testing.gen_test
    @pytest.mark.skipif(os.name == 'nt', reason="Doesn't work on Windows")
    def test_terminal_resize(self):
        """Test terminal resizing."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )

        pid = response.body.decode('utf-8')
        sock = yield self._mk_connection(pid)
        _ = yield sock.read_message()

        data = {'rows': '23', 'cols': '73'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals/{0}/size'.format(pid)),
            method="POST",
            body=urlencode(data)
        )

        sock.write_message('cd {0}{1}'.format(LOCATION_SLASH, LINE_END))

        # Use the current python interpreter to execute print_size.py if it
        # can be determined by sys.executable. Otherwise just hope that there
        # is a `python` in the shell's path which works with the script.
        python_bin = sys.executable or "python"
        python_exec = python_bin + ' print_size.py' + LINE_END
        sock.write_message(python_exec)

        expected_size = '(73, 23)'
        msg = ''
        fail_retry = 50
        tries = 0
        while expected_size not in msg:
            if tries == fail_retry:
                break
            msg = yield sock.read_message()
            tries += 1
        self.assertIn(expected_size, msg)
        yield self.close(sock)

    @flaky(max_runs=3)
    @testing.gen_test
    def test_terminal_reconnect_preserves_shell_state(self):
        """A reconnect during the grace period must reattach to the same PTY."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        pid = response.body.decode('utf-8')

        sock = yield self._mk_connection(pid)
        _ = yield sock.read_message()
        sock.write_message('cd {0}{1}'.format(LOCATION_SLASH, LINE_END))
        sock.write_message('pwd{0}'.format(LINE_END))
        msg = yield self.read_until(sock, LOCATION_SLASH)
        self.assertIn(LOCATION_SLASH, msg)

        sock.close()
        yield gen.sleep(0.1)

        sock = yield self._mk_connection(pid)
        sock.write_message('pwd{0}'.format(LINE_END))
        msg = yield self.read_until(sock, LOCATION_SLASH)
        self.assertIn(LOCATION_SLASH, msg)
        yield self.close(sock)

    @flaky(max_runs=3)
    @testing.gen_test
    def test_terminal_multi_client_reconnect_within_grace(self):
        """A shared PTY survives when all clients briefly disconnect."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        pid = response.body.decode('utf-8')

        sock1 = yield self._mk_connection(pid)
        _ = yield sock1.read_message()
        sock2 = yield self._mk_connection(pid)

        sock1.write_message('cd {0}{1}'.format(LOCATION_SLASH, LINE_END))
        sock2.write_message('pwd{0}'.format(LINE_END))
        msg = yield self.read_until(sock2, LOCATION_SLASH)
        self.assertIn(LOCATION_SLASH, msg)

        sock1.close()
        sock2.close()
        yield gen.sleep(0.1)

        sock3 = yield self._mk_connection(pid)
        sock3.write_message('pwd{0}'.format(LINE_END))
        msg = yield self.read_until(sock3, LOCATION_SLASH)
        self.assertIn(LOCATION_SLASH, msg)
        yield self.close(sock3)

    @flaky(max_runs=3)
    @testing.gen_test
    def test_terminal_expired_session_closes_with_stale_signal(self):
        """A reconnect after grace expiry must fail with the stale-session signal."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        pid = response.body.decode('utf-8')

        sock = yield self._mk_connection(pid)
        _ = yield sock.read_message()
        sock.close()
        yield gen.sleep((self.disconnect_grace_ms / 1000.0) + 0.25)

        sock = yield self._mk_connection(pid)
        msg = yield sock.read_message()
        yield gen.sleep(0.1)
        self.assertIsNone(msg)
        self.assertTrue(
            sock.close_code == 4404 or sock.close_reason == 'terminal-not-found'
        )

    @flaky(max_runs=3)
    @pytest.mark.timeout(10)
    @testing.gen_test
    @pytest.mark.skipif(os.name == 'nt', reason="Doesn't work on Windows")
    def test_terminal_resize_during_grace_reuses_same_pty(self):
        """Resize requests during grace apply to the same PTY."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )

        pid = response.body.decode('utf-8')
        sock = yield self._mk_connection(pid)
        _ = yield sock.read_message()
        sock.close()
        yield gen.sleep(0.1)

        data = {'rows': '23', 'cols': '73'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals/{0}/size'.format(pid)),
            method="POST",
            body=urlencode(data)
        )
        self.assertEqual(response.code, 200)

        sock = yield self._mk_connection(pid)
        sock.write_message('cd {0}{1}'.format(LOCATION_SLASH, LINE_END))
        python_bin = sys.executable or "python"
        sock.write_message(python_bin + ' print_size.py' + LINE_END)

        msg = yield self.read_until(sock, '(73, 23)')
        self.assertIn('(73, 23)', msg)
        yield self.close(sock)

    @flaky(max_runs=3)
    @testing.gen_test
    def test_resize_expired_terminal_is_ignored_safely(self):
        """Resize against an expired PTY should not recreate the session."""
        data = {'rows': '25', 'cols': '80'}
        response = yield self.http_client.fetch(
            self.get_url('/api/terminals'),
            method="POST",
            body=urlencode(data)
        )
        pid = response.body.decode('utf-8')

        sock = yield self._mk_connection(pid)
        _ = yield sock.read_message()
        sock.close()
        yield gen.sleep((self.disconnect_grace_ms / 1000.0) + 0.25)

        response = yield self.http_client.fetch(
            self.get_url('/api/terminals/{0}/size'.format(pid)),
            method="POST",
            body=urlencode({'rows': '24', 'cols': '90'})
        )
        self.assertEqual(response.code, 200)

        sock = yield self._mk_connection(pid)
        msg = yield sock.read_message()
        yield gen.sleep(0.1)
        self.assertIsNone(msg)
        self.assertTrue(
            sock.close_code == 4404 or sock.close_reason == 'terminal-not-found'
        )
