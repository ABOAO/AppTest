#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_PATH="$ROOT_DIR/ios-pwnagotchi.xcodeproj"
SCHEME="ios-pwnagotchi"
ARCHIVE_PATH="$ROOT_DIR/build/ios-pwnagotchi.xcarchive"
EXPORT_PATH="$ROOT_DIR/build/export"
EXPORT_OPTIONS="$ROOT_DIR/scripts/exportOptions.plist"

mkdir -p "$ROOT_DIR/build"

xcodebuild \
  -project "$PROJECT_PATH" \
  -scheme "$SCHEME" \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath "$ARCHIVE_PATH" \
  archive

xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS"

echo "✅ iOS archive/export complete: $EXPORT_PATH"
