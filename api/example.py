import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.http import is_htmx, send_html
from lib.render import render


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        # RDB 연결 전: 샘플 데이터. 연결 후 lib.db.connection() 조회로 교체.
        items = [
            {"id": 1, "name": "Alpha"},
            {"id": 2, "name": "Beta"},
        ]

        if is_htmx(self):
            body = render("fragments/example-list.html", items=items)
        else:
            body = render(
                "layouts/base.html",
                title="Stitch Invi",
                content=render("fragments/example-list.html", items=items),
            )

        send_html(self, body)
