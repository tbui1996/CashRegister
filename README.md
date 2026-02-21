# Cash Register

## The Problem
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

## Sample Input
2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

* What might happen if the client needs to change the random divisor?
* What might happen if the client needs to add another special case (like the random twist)?
* What might happen if sales closes a new client in France?



# Cash Register Backend

A Go-based REST API for calculating change with intelligent denomination handling. Built with hexagonal architecture for maintainability and scalability.

## 📋 Prerequisites

- **Go 1.21** or higher ([Download](https://golang.org/dl/))
- **Git** (for version control)
- **Make** (usually pre-installed on macOS/Linux)

Verify your Go installation:
```bash
go version
```

## 🚀 Getting Started

### Option 1: Using Make (Recommended)

```bash
# Install dependencies and download Go modules
make install

# Start the server
make backend-run
```

### Option 2: Manual Commands

#### Step 1: Download and Install Dependencies

```bash
cd backend

# Download all required Go modules
go mod download

# Verify and clean up go.mod/go.sum
go mod tidy
```

This will download:
- `github.com/gorilla/mux` - HTTP router
- `github.com/gorilla/handlers` - CORS and logging middleware

#### Step 2: Run the Server

```bash
go run ./cmd/main.go
```

The server will start on `http://localhost:8080`

#### Step 3: Verify Health

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{"status":"healthy"}
```

## 📦 Project Structure

```
backend/
├── cmd/
│   └── main.go                      # Application entry point
├── internal/
│   ├── domain/
│   │   └── change.go               # Core business logic
│   ├── ports/
│   │   └── http_handler.go         # Interface definitions
│   └── adapters/
│       ├── http/
│       │   └── handler.go          # HTTP handlers
│       └── storage/                # Storage adapter (extensible)
├── go.mod                          # Module definition
├── go.sum                          # Dependency checksums
```

## 🔗 API Endpoints

### 1. Single Change Calculation

Calculate change for a single transaction.

**Endpoint:** `POST /api/change`

**Request:**
```bash
curl -X POST http://localhost:8080/api/change \
  -H "Content-Type: application/json" \
  -d '{
    "amountOwed": 2.13,
    "amountPaid": 3.00
  }'
```

**Response:**
```json
{
  "amountOwed": 2.13,
  "amountPaid": 3.00,
  "change": 0.87,
  "denominations": {
    "quarter": 3,
    "dime": 1,
    "penny": 2
  },
  "formattedChange": "3 quarters,1 dime,2 pennies"
}
```

### 2. Batch Change Calculation

Process multiple transactions at once.

**Endpoint:** `POST /api/change/batch`

**Request:**
```bash
curl -X POST http://localhost:8080/api/change/batch \
  -H "Content-Type: application/json" \
  -d '[
    {"amountOwed": 2.12, "amountPaid": 3.00},
    {"amountOwed": 1.97, "amountPaid": 2.00},
    {"amountOwed": 3.33, "amountPaid": 5.00}
  ]'
```

**Response:**
```json
[
  {
    "amountOwed": 2.12,
    "amountPaid": 3.00,
    "change": 0.88,
    "denominations": {...},
    "formattedChange": "3 quarters,1 dime,3 pennies"
  },
  ...
]
```

### 3. File Upload (CSV)

Upload a CSV file with multiple transactions.

**Endpoint:** `POST /api/change/file`

**File Format (CSV):**
```
2.12,3.00
1.97,2.00
3.33,5.00
```

**Request:**
```bash
curl -X POST http://localhost:8080/api/change/file \
  -F "file=@transactions.csv"
```

**Response:**
Same as batch calculation (array of results).

### 4. Health Check

**Endpoint:** `GET /health`

**Request:**
```bash
curl http://localhost:8080/health
```

**Response:**
```json
{"status":"healthy"}
```

## 🏗️ Hexagonal Architecture

This backend follows the **Hexagonal Architecture** (Ports & Adapters) pattern:

```
┌─────────────────────────────────────────┐
│         HTTP Request (Adapter)          │
├─────────────────────────────────────────┤
│    Handler (Port Implementation)        │
├─────────────────────────────────────────┤
│     Domain Logic (Business Rules)       │
│  • CalculateChange()                   │
│  • FormatResult()                      │
│  • Randomization Logic                 │
├─────────────────────────────────────────┤
│    Storage Adapter (Extensible)         │
└─────────────────────────────────────────┘
```

## 🧪 Testing

### Run All Tests

```bash
go test ./...
```

### Run Tests with Verbose Output

```bash
go test -v ./...
```

### Run Tests with Coverage

```bash
go test -cover ./...
```

### Run Specific Package Tests

```bash
go test ./internal/domain -v
```

## Local Development (no Docker)

Docker support has been removed from this project per development preferences. Run the backend locally using the included `run.sh` script or `go run`.

Commands:

```bash
cd backend
./run.sh
# or
go run ./cmd/main.go
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port |

**Example:**
```bash
PORT=9000 go run ./cmd/main.go
```


# Cash Register Frontend

A modern React application for calculating change with a responsive Material-UI interface. Built with React 18, Recoil for state management, and React-Query for server state handling.

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** (comes with Node.js)
- **Git** (for version control)

Verify your Node.js and npm installation:
```bash
node --version
npm --version
```

## 🚀 Getting Started

### Option 1: Using Make (Recommended)

From the root directory:

```bash
# Install dependencies
make install

# Start the development server
make frontend-run
```

### Option 2: Manual Commands

#### Step 1: Download and Install Dependencies

```bash
cd frontend

# Install all npm packages
npm install
```

This will install:
- **React** & **React-DOM** - UI framework
- **React-Query** - Server state management
- **Recoil** - Client state management
- **Material-UI (@mui/material)** - Component library
- **Axios** - HTTP client
- **Vite** - Build tool

#### Step 2: Start Development Server

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

#### Step 3: Build for Production

```bash
npm run build
```

Creates an optimized build in the `dist/` folder.

## 📋 Dependencies Guide

### Main Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | DOM rendering |
| `react-query` | ^3.39.3 | Server state & caching |
| `recoil` | ^0.7.7 | Global state management |
| `@mui/material` | ^5.14.0 | UI components |
| `@mui/icons-material` | ^5.14.0 | Icon library |
| `@emotion/react` | ^11.11.0 | CSS-in-JS (required by MUI) |
| `@emotion/styled` | ^11.11.0 | Styled components |
| `axios` | ^1.4.0 | HTTP client |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^4.3.9 | Build tool |
| `@vitejs/plugin-react` | ^4.0.0 | React support for Vite |
| `@types/react` | ^18.2.0 | TypeScript types |
| `@types/react-dom` | ^18.2.0 | TypeScript types |

## 🎯 Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint (optional)
npm run lint
```

### Makefile Alternatives

From the root directory:

```bash
make frontend-run    # Start dev server
make frontend-build  # Build for production
make install         # Install dependencies
```

## 🌐 API Configuration

### Default Configuration

The app connects to the backend at `http://localhost:8080` by default.

## Local Development (no Docker)

This project is configured to run locally during development.

Commands:

```bash
cd frontend
npm run dev
# Build for production
npm run build
```

## 📄 License

MIT
