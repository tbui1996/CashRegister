.PHONY: help build up down logs clean rebuild backend-build frontend-build backend-run frontend-run backend-test

help:
@echo "Cash Register Application - Makefile Commands"
@echo ""
@echo "Local Development:"
@echo "  make install        - Install backend and frontend dependencies"
@echo "  make backend-run    - Run backend locally (requires Go installed)"
@echo "  make frontend-run   - Run frontend locally (requires Node.js installed)"
@echo ""
@echo "Testing & Quality:"
@echo "  make backend-test   - Run Go tests"
@echo "  make lint           - Run linters"

clean:
	@echo "Cleaning build artifacts"
	-rm -rf frontend/dist
	@echo "Clean complete"

# Local development commands
install:
	@echo "Installing backend dependencies..."
	cd backend && go mod download && go mod tidy
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

backend-run:
	@echo "Starting backend server..."
	cd backend && ./run.sh

frontend-run:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

backend-test:
	@echo "Running backend tests..."
	cd backend && go test -v ./...

# Shell helpers (local)
shell-backend:
	@echo "Run: cd backend && ./run.sh"

shell-frontend:
	@echo "Run: cd frontend && npm run dev"

# View health status
health:
	@curl -s http://localhost:8080/health | jq . || echo "Backend not responding"

# Open in browser (macOS)
open:
	open http://localhost:3000
