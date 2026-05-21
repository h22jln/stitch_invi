from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

_ROOT = Path(__file__).resolve().parent.parent
_TEMPLATES = _ROOT / "templates"

_env = Environment(
    loader=FileSystemLoader(_TEMPLATES),
    autoescape=select_autoescape(["html", "xml"]),
)


def render(name: str, **context: object) -> str:
    return _env.get_template(name).render(**context)
