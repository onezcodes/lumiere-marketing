#!/usr/bin/env bash
# Saves what the booted iOS simulator shows as public/screens/<name>.png, with a clean status bar.
# Usage: npm run screen -- home      (open the screen in the simulator first)
set -euo pipefail

name="${1:-}"
names="onboarding confirm-sign welcome-plus home my-reading lumiere-element tarot birth-chart matrix timing match match-matrix match-mahabote games readers reader-profile personal-reading booking messages credits studio"
if [[ -z "$name" ]] || [[ " $names " != *" $name "* ]]; then
    echo "Usage: npm run screen -- <name>"
    echo "Names: $names"
    exit 1
fi

if ! xcrun simctl list devices booted | grep -q Booted; then
    echo "No simulator is booted. Run the Lumiere app in Xcode on an iPhone simulator first."
    exit 1
fi

xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularMode active --cellularBars 4 --wifiBars 3 >/dev/null
sleep 0.5
mkdir -p "$(dirname "$0")/../screens-raw"
out="$(cd "$(dirname "$0")/.." && pwd)/screens-raw/$name.png"
xcrun simctl io booted screenshot --type=png "$out" >/dev/null 2>&1
echo "Saved $out — run npm run screens to make the WebP sizes"
