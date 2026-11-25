#!/usr/bin/env bash
# Rebuilds bookmarklet/bookmarklet.txt from the userscript.
# Needs Node.js; terser is fetched through npx.
set -euo pipefail
cd "$(dirname "$0")/.."

min="$(npx --yes terser extension/arena-skate-count.user.js --compress --mangle)"
MIN="$min" node -e '
  const src = process.env.MIN.trim();
  if (!src) { console.error("minify produced nothing"); process.exit(1); }
  process.stdout.write("javascript:" + encodeURIComponent(src) + "void 0\n");
' > bookmarklet/bookmarklet.txt

echo "bookmarklet/bookmarklet.txt: $(wc -c < bookmarklet/bookmarklet.txt) bytes"
