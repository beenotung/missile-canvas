#!/bin/bash
set -e
set -u
set -o pipefail

npm run build

rm -rf public
mkdir public
cp index.html bundle.js public/
npx surge public https://missile-canvas.surge.sh
rm -rf public
