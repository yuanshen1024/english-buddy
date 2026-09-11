#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/yywz"
OUTPUT="${1:-$ROOT/_site}"
REPOSITORY="${GITHUB_REPOSITORY:-yuanshen1024/english-buddy}"
REPOSITORY_NAME="${REPOSITORY#*/}"
REPOSITORY_NAME_LOWER="$(printf '%s' "$REPOSITORY_NAME" | tr '[:upper:]' '[:lower:]')"
if [[ -n "${PAGES_BASE_OVERRIDE:-}" ]]; then
  BASE="$PAGES_BASE_OVERRIDE"
elif [[ "$REPOSITORY_NAME_LOWER" == *.github.io ]]; then
  BASE=""
else
  BASE="/$REPOSITORY_NAME"
fi

rm -rf "$OUTPUT"
mkdir -p "$OUTPUT"
cp -R "$SITE/." "$OUTPUT/"

PYTHONPATH= python3 - "$OUTPUT" "$BASE" <<'PY'
import sys
from pathlib import Path

output = Path(sys.argv[1])
base = sys.argv[2]

index_path = output / "index.html"
content = index_path.read_text(encoding="utf-8")
content = content.replace(
    '<meta name="app-base" content="" />',
    f'<meta name="app-base" content="{base}" />',
)
if base:
    content = content.replace('href="/assets/', f'href="{base}/assets/')
    content = content.replace('src="/assets/', f'src="{base}/assets/')

index_path.write_text(content, encoding="utf-8")
(output / "404.html").write_text(content, encoding="utf-8")
(output / ".nojekyll").write_text("", encoding="utf-8")
print(f"Pages build created at {output} with base {base or '/'}")
PY
