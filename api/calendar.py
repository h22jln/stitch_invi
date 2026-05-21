import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.http import send_html
from lib.render import render


def _calendar_context() -> dict:
    # May 2024 — 1일이 수요일 → 앞칸 3개 (28, 29, 30)
    return {
        "month_offset": 3,
        "pad_days": [28, 29, 30],
        "days_in_month": 31,
        "selected_day": 15,
        "events": {5, 12, 15, 22},
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        send_html(
            self,
            render("fragments/calendar-screen.html", **_calendar_context()),
        )
