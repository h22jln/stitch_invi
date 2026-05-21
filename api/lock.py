import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.http import send_html
from lib.render import render


def _notifications() -> list[dict[str, str]]:
    # RDB 연결 후 lib.db에서 조회
    return [
        {
            "app": "Messages",
            "time": "2m ago",
            "body": "준비 다 됐어? 공원에서 기다릴게!",
            "icon": "messages",
        },
    ]


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        fragment = render(
            "fragments/lock-notifications.html",
            notifications=_notifications(),
        )
        send_html(self, fragment)
