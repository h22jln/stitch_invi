import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.http import send_html


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        send_html(self, "<p>ok</p>")
