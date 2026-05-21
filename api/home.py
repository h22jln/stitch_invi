import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.http import send_html
from lib.render import render


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        send_html(self, render("fragments/home-screen.html"))
