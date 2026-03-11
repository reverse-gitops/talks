"""
Spawn a websocket that handles forking of shell sessions for attachment by the bertdotbill WebTerminal UI element. 
The code for this was taken from [spyder-terminal](https://github.com/spyder-ide/spyder-terminal).
"""

import argparse
import os
from btwebterminal.webterminal import WebTerminal

def main():
    """The main entrypoint
    """

    parser = argparse.ArgumentParser(description="btwebterminal - A websocket-based shell session handler")

    parser.add_argument('--host',
                        default=os.environ.get('WEBTERMINAL_HOST', '127.0.0.1'),
                        help='Host to listen on (default: 0.0.0.0 or WEBTERMINAL_HOST env var)')

    parser.add_argument('--port',
                        type=int,
                        default=int(os.environ.get('WEBTERMINAL_PORT', 10001)),
                        help='Port to listen on (default: 10001 or WEBTERMINAL_PORT env var)')

    parser.add_argument('--shell',
                        default=os.environ.get('WEBTERMINAL_SHELL'),
                        help='Shell to spawn, can also be set with WEBTERMINAL_SHELL env var')

    parser.add_argument('--debug',
                        action='store_true',
                        default=os.environ.get('WEBTERMINAL_DEBUG', 'false').lower() == 'true',
                        help='Enable debug mode (default: False or WEBTERMINAL_DEBUG=true env var)')

    parser.add_argument('--pty-disconnect-grace-ms',
                        type=int,
                        default=int(os.environ.get('PTY_DISCONNECT_GRACE_MS', 30000)),
                        help='PTY disconnect grace period in milliseconds (default: 30000 or PTY_DISCONNECT_GRACE_MS env var)')

    args = parser.parse_args()

    WebTerminal().start(
        host=args.host,
        port=args.port,
        shell=args.shell,
        debug=args.debug,
        pty_disconnect_grace_ms=args.pty_disconnect_grace_ms,
    )

if __name__ == '__main__':
    main()

