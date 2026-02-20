package ports

import (
	"github.com/tbui1996/cash-register/internal/domain"
)

// ChangeService defines the interface for change calculation
type ChangeService interface {
	CalculateChange(request domain.ChangeRequest) (*domain.ChangeResult, error)
	ProcessBatch(requests []domain.ChangeRequest) ([]string, error)
}

// HTTPHandler interface for handling HTTP requests
type HTTPHandler interface {
	CalculateChange(amountOwed, amountPaid float64) (*domain.ChangeResult, error)
	ProcessFile(content string) ([]string, error)
}
