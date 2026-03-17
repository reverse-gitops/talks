# -*- coding: iso-8859-15 -*-

"""Basic HTTP handler for service status."""
import tornado.web
import tornado.escape
from os import getcwd
from urllib.parse import quote


class MainHandler(tornado.web.RequestHandler):
    """Handles index request."""

    def initialize(self, db=None):
        """Stump initialization function."""
        self.db = db

    @tornado.gen.coroutine
    def get(self):
        """Return a small status payload for clients hitting / directly."""
        cwd = self.get_argument('path', getcwd())
        # We need to do percent encoding for sending the cwd through a cookie
        # For further information see spyder-ide/spyder-terminal#225
        self.set_cookie('cwd', quote(cwd))
        self.set_header('Content-Type', 'application/json; charset=utf-8')
        self.write({
            "service": "bt-webterminal",
            "status": "ok",
            "create_terminal": "/api/terminals",
            "attach_terminal": "/terminals/:id",
        })

    @tornado.gen.coroutine
    def post(self):
        """POST verb: Forbidden."""
        self.set_status(403)
