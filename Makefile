.PHONY: help build up down logs clean rebuild backend-build frontend-build backend-run frontend-run backend-test

help:
	@echo "Cash Register Application - Makefile Commands"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make build          - Build both backend and frontend Docker images"
	@echo "  make up             - Start containers in the background"
	@echo "  make down           - Stop and remove containers"
	@echo "  make logs           - View logs from all containers"
	@echo "  make logs-backend   - View backend logs"
	@echo "  make logs-frontend  - View frontend logs"
	@echo "  make rebuild        - Rebuild images without cache and start"
	@echo "  make clean          - Stop containers and remove images"
	@echo ""
	@echo "Local Development:"
	@echo "  make backend-run    - Run backend locally (requires Go installed)"
	@echo "  make frontend-run   - Run frontend locally (requires Node.js installed)"
	@echo "  make install        - Install Go and Node dependencies"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make backend-test   - Run Go tests"
	@echo "  make lint           - Run linters"

# Docker commands
build:
	@echo "Building Docker images..."
	docker-compose build

up:
	@echo "Starting containers..."
	docker-compose up -d
	@echo "Services starting. Check with 'make logs'"

down:
	@echo "Stopping containers..."
	docker-compose down

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

rebuild: clean build up
	@echo "Application rebuilt and started"

clean:
	@echo "Cleaning up containers and images..."
	docker-compose down -v
	docker-compose ps -a
	@echo "Cleanup complete"

ps:
	docker-compose ps

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

# Shell into containers
shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

# View health status
health:
	@curl -s http://localhost:8080/health | jq . || echo "Backend not responding"

# Open in browser (macOS)
open:
	open http://localhost:3000
