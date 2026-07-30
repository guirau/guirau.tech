#!/usr/bin/env bash
# Regenerates assets/fonts/*.woff2 from the geist npm package.
# Requires: python3 -m venv /tmp/fontenv && /tmp/fontenv/bin/pip install fonttools brotli
set -euo pipefail

cd "$(dirname "$0")/../.."
SUBSET="${PYFTSUBSET:-/tmp/fontenv/bin/pyftsubset}"
SRC="node_modules/geist/dist/fonts"

# U+0000-00FF  Latin-1 (covers the accented names: Telefonica, Masterschool)
# U+2018-201D  curly quotes    U+2013-2014  en/em dash (CONTENT.md has em dashes)
# U+00B7       middle dot, used in every price/duration string
# U+2026       ellipsis, used in "Claude, OpenAI, Gemini..."
UNICODES="U+0000-00FF,U+2013-2014,U+2018-201D,U+00B7,U+2026"

subset () {
  "$SUBSET" "$1" \
    --output-file="$2" \
    --flavor=woff2 \
    --layout-features='kern,liga,calt' \
    --unicodes="$UNICODES" \
    --no-hinting \
    --desubroutinize
  echo "  $2  $(wc -c < "$2") bytes"
}

mkdir -p assets/fonts
echo "Subsetting Geist:"
subset "$SRC/geist-sans/Geist-Variable.woff2" assets/fonts/geist-sans.woff2
subset "$SRC/geist-mono/GeistMono-Variable.woff2" assets/fonts/geist-mono.woff2
