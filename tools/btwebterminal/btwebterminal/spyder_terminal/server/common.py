
"""General server constants and utillty functions."""

import os
import os.path

import tornado

import btwebterminal.spyder_terminal.server.routes as routes
from btwebterminal.spyder_terminal.server.logic.term_manager import TermManager


def create_app(shell, close_future=None, **kwargs):
    """Create and return a tornado Web Application instance."""
    grace_ms = kwargs.pop('pty_disconnect_grace_ms', None)
    debug = kwargs.get('debug')
    serve_traceback = kwargs.get('serve_traceback')
    autoreload = kwargs.get('autoreload')
    settings = {"static_path": os.path.join(
        os.path.dirname(__file__), "static")}

    if grace_ms is None:
        grace_ms = int(os.environ.get('PTY_DISCONNECT_GRACE_MS', 30000))

    application = tornado.web.Application(routes.gen_routes(close_future),
                                          debug=debug,
                                          serve_traceback=serve_traceback,
                                          autoreload=autoreload, **settings)
    application.term_manager = TermManager([shell], disconnect_grace_ms=grace_ms)
    return application
