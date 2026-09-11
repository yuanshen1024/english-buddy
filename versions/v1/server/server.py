#!/usr/bin/env python3
"""Small SPA server for English Buddy.

Serves index.html for clean application routes such as /notes and /exams/mock.
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import argparse
import os
from functools import partial
from pathlib import Path
from urllib.parse import unquote, urlparse


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class EnglishBuddyHandler(SimpleHTTPRequestHandler):
    def _serve_spa_route(self):
        route_path = unquote(urlparse(self.path).path)
        file_path = self.translate_path(route_path)

        if not os.path.isfile(file_path):
            self.path = "/index.html"

    def do_GET(self):
        self._serve_spa_route()
        super().do_GET()

    def do_HEAD(self):
        self._serve_spa_route()
        super().do_HEAD()


def main():
    parser = argparse.ArgumentParser(description="Run the English Buddy app.")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()

    handler = partial(EnglishBuddyHandler, directory=str(PROJECT_ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"English Buddy is running at http://127.0.0.1:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
