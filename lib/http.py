from http.server import BaseHTTPRequestHandler


def is_htmx(handler: BaseHTTPRequestHandler) -> bool:
    return handler.headers.get("HX-Request") == "true"


def send_html(
    handler: BaseHTTPRequestHandler,
    body: str,
    *,
    status: int = 200,
) -> None:
    payload = body.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "text/html; charset=utf-8")
    handler.send_header("Content-Length", str(len(payload)))
    handler.end_headers()
    handler.wfile.write(payload)


def send_error_fragment(
    handler: BaseHTTPRequestHandler,
    body: str,
    *,
    status: int = 422,
) -> None:
    send_html(handler, body, status=status)
