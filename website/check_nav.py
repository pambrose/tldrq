"""Fails when the nav in zensical.toml and the pages under docs/ disagree.

`zensical build --strict` doesn't report a nav entry whose page is missing, so
.github/workflows/docs.yml runs this before the build. Run it from website/tldrq:

    uv run --locked python ../check_nav.py
"""

import sys
import tomllib
from pathlib import Path


def nav_files(entries):
    for entry in entries:
        for value in entry.values():
            if isinstance(value, list):
                yield from nav_files(value)
            elif not value.startswith(("http://", "https://")):
                yield value


config = tomllib.loads(Path("zensical.toml").read_text())
docs = Path("docs")
listed = set(nav_files(config["project"]["nav"]))
pages = {page.relative_to(docs).as_posix() for page in docs.rglob("*.md")}

problems = [f"missing page: {path}" for path in sorted(listed - pages)]
problems += [f"page not in nav: {path}" for path in sorted(pages - listed)]
for problem in problems:
    print(problem)
sys.exit(1 if problems else 0)
