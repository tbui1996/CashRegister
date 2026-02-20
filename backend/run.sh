#!/bin/bash
# Run Go backend on macOS Intel
# 
# Note: Due to a known issue with Go 1.21.4 on Intel macOS, compiled binaries may fail with
# "missing LC_UUID load command". Workarounds:
#
# 1. Upgrade Go: brew upgrade go
# 2. If needed, run on a Linux VM or container outside this host

cd "$(dirname "$0")" || exit 1

# Try using go run (may have UUID issues but worth trying)
PORT=${PORT:-8080} go run ./cmd/main.go 2>&1 || {
    echo ""
    echo "⚠️  Go binary execution failed on this macOS/Go version combination"
    echo ""
    echo "Fix: Upgrade Go to the latest version"
    echo "  brew upgrade go"
    echo ""
    echo "If upgrading doesn't help, please run the backend on a Linux container or different machine." 
    exit 1
}
