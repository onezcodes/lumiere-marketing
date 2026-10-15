#!/usr/bin/env bash
# Turns raw simulator PNGs into the two WebP sizes the site loads: <name>-360.webp and <name>-720.webp.
# Light captures sit in screens-raw/, dark-appearance captures in screens-raw/dark/ (→ public/screens/dark/).
# Usage: npm run screens   Needs cwebp (brew install webp).
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
command -v cwebp >/dev/null || { echo "cwebp not found: brew install webp"; exit 1; }
convert() {
    local src="$1" out="$2"
    mkdir -p "$out"
    for png in "$src"/*.png; do
        [ -e "$png" ] || continue
        name=$(basename "$png" .png)
        cwebp -quiet -q 78 -resize 360 0 "$png" -o "$out/$name-360.webp"
        cwebp -quiet -q 74 -resize 720 0 "$png" -o "$out/$name-720.webp"
        echo "$(basename "$out")/$name: $(($(stat -f%z "$out/$name-360.webp") / 1024)) KB / $(($(stat -f%z "$out/$name-720.webp") / 1024)) KB"
    done
}
convert "$root/screens-raw" "$root/public/screens"
convert "$root/screens-raw/dark" "$root/public/screens/dark"
