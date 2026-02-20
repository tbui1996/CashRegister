package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/tbui1996/cash-register/internal/domain"
)

// Handler handles HTTP requests for change calculation
type Handler struct {
	changeService domain.ChangeRequest
}

// NewHandler creates a new HTTP handler
func NewHandler() *Handler {
	return &Handler{}
}

// CalculateChangeRequest represents the API request
type CalculateChangeRequest struct {
	AmountOwed float64 `json:"amountOwed"`
	AmountPaid float64 `json:"amountPaid"`
}

// CalculateChangeResponse represents the API response
type CalculateChangeResponse struct {
	AmountOwed      float64        `json:"amountOwed"`
	AmountPaid      float64        `json:"amountPaid"`
	Change          float64        `json:"change"`
	Denominations   map[string]int `json:"denominations"`
	FormattedChange string         `json:"formattedChange"`
}

// HandleCalculateChange handles POST requests for change calculation
func (h *Handler) HandleCalculateChange(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CalculateChangeRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	changeRequest := domain.ChangeRequest{
		AmountOwed: req.AmountOwed,
		AmountPaid: req.AmountPaid,
	}

	cfg := GetConfig()
	result, err := domain.CalculateChange(changeRequest, cfg.RandomDivisor, cfg.Country, cfg.SpecialCases)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response := CalculateChangeResponse{
		AmountOwed:      req.AmountOwed,
		AmountPaid:      req.AmountPaid,
		Change:          result.Total,
		Denominations:   result.Denominations,
		FormattedChange: domain.FormatResult(result),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// HandleBatchCalculate handles POST requests for batch change calculation
func (h *Handler) HandleBatchCalculate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var requests []CalculateChangeRequest
	err := json.NewDecoder(r.Body).Decode(&requests)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var responses []CalculateChangeResponse

	for _, req := range requests {
		changeRequest := domain.ChangeRequest{
			AmountOwed: req.AmountOwed,
			AmountPaid: req.AmountPaid,
		}

		cfg := GetConfig()
		result, err := domain.CalculateChange(changeRequest, cfg.RandomDivisor, cfg.Country, cfg.SpecialCases)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		response := CalculateChangeResponse{
			AmountOwed:      req.AmountOwed,
			AmountPaid:      req.AmountPaid,
			Change:          result.Total,
			Denominations:   result.Denominations,
			FormattedChange: domain.FormatResult(result),
		}

		responses = append(responses, response)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)
}

// HandleFileUpload handles file uploads with change data
func (h *Handler) HandleFileUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to read file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file content
	buf := make([]byte, 1024*1024) // 1MB max
	n, err := file.Read(buf)
	if err != nil {
		http.Error(w, "Failed to read file content", http.StatusBadRequest)
		return
	}

	content := string(buf[:n])
	lines := strings.Split(strings.TrimSpace(content), "\n")

	var responses []CalculateChangeResponse

	for _, line := range lines {
		if line == "" {
			continue
		}

		parts := strings.Split(line, ",")
		if len(parts) != 2 {
			http.Error(w, fmt.Sprintf("Invalid line format: %s", line), http.StatusBadRequest)
			return
		}

		amountOwed, err := strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid amount owed: %s", parts[0]), http.StatusBadRequest)
			return
		}

		amountPaid, err := strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid amount paid: %s", parts[1]), http.StatusBadRequest)
			return
		}

		changeRequest := domain.ChangeRequest{
			AmountOwed: amountOwed,
			AmountPaid: amountPaid,
		}

		cfg := GetConfig()
		result, err := domain.CalculateChange(changeRequest, cfg.RandomDivisor, cfg.Country, cfg.SpecialCases)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		response := CalculateChangeResponse{
			AmountOwed:      amountOwed,
			AmountPaid:      amountPaid,
			Change:          result.Total,
			Denominations:   result.Denominations,
			FormattedChange: domain.FormatResult(result),
		}

		responses = append(responses, response)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)
}
