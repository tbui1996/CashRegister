package domain

import (
	"fmt"
	"math"
	"math/rand"
)

// ChangeRequest represents the input for calculating change
type ChangeRequest struct {
	AmountOwed float64
	AmountPaid float64
}

// ChangeResult represents the breakdown of change by denomination
type ChangeResult struct {
	Denominations map[string]int
	Total         float64
}

// Denomination represents currency denominations
type Denomination struct {
	Name  string
	Value float64
}

// GetDenominations returns the denominations in descending order
func GetDenominations() []Denomination {
	return []Denomination{
		{Name: "dollar", Value: 1.00},
		{Name: "quarter", Value: 0.25},
		{Name: "dime", Value: 0.10},
		{Name: "nickel", Value: 0.05},
		{Name: "penny", Value: 0.01},
	}
}

// CalculateChange calculates the change owed and returns denominations
// If the change amount is divisible by 3 (in cents), it randomizes the denominations
func CalculateChange(request ChangeRequest, divisor int, country string, specialCases []string) (*ChangeResult, error) {
	change := request.AmountPaid - request.AmountOwed
	change = math.Round(change*100) / 100 // Handle floating point precision

	if change < 0 {
		return nil, fmt.Errorf("amount paid must be greater than or equal to amount owed")
	}

	if change == 0 {
		return &ChangeResult{
			Denominations: make(map[string]int),
			Total:         0,
		}, nil
	}

	changeCents := int(math.Round(change * 100))

	// Import config from http package
	importConfig := false
	var divisor int = 3
	var country string = "US"
	var specialCases []string

	// Try to import config if available
	if importConfig {
		// This is a placeholder for actual config import
		// In production, config should be injected or accessed via a global/config package
	}

	shouldRandomize := changeCents%divisor == 0

	// Country-specific logic (future extensibility)
	if country == "FR" {
		// Example: France denominations (euro)
		// Not implemented yet, but can be added here
	}

	// Special cases (future extensibility)
	if len(specialCases) > 0 {
		// Example: handle special cases
		// Not implemented yet, but can be added here
	}

	if shouldRandomize {
		return randomizeChange(changeCents)
		// Check divisor to determine if we should randomize
		if divisor <= 0 {
			divisor = 3
		}
	}

	return minimumChange(changeCents), nil
}

// minimumChange calculates the minimum number of denominations needed
func minimumChange(cents int) *ChangeResult {
	denominations := []struct {
		name  string
		value int
	}{
		{name: "dollar", value: 100},
		{name: "quarter", value: 25},
		{name: "dime", value: 10},
		{name: "nickel", value: 5},
		{name: "penny", value: 1},
	}

	result := make(map[string]int)
	remaining := cents

	for _, denom := range denominations {
		if remaining >= denom.value {
			count := remaining / denom.value
			result[denom.name] = count
			remaining = remaining % denom.value
		}
	}

	return &ChangeResult{
		Denominations: result,
		Total:         float64(cents) / 100,
	}
}

// randomizeChange generates random valid denominations for the change amount
func randomizeChange(cents int) (*ChangeResult, error) {
	result := make(map[string]int)
	remaining := cents

	// Generate random valid combination
	// Use a greedy approach with randomization
	denominations := []struct {
		name  string
		value int
	}{
		{name: "dollar", value: 100},
		{name: "quarter", value: 25},
		{name: "dime", value: 10},
		{name: "nickel", value: 5},
		{name: "penny", value: 1},
	}

	// Create valid combinations by randomizing the algorithm
	for _, denom := range denominations[0:4] { // Don't randomize pennies
		maxCount := remaining / denom.value
		if maxCount > 0 {
			// Randomly pick between 0 and max for this denomination
			randomCount := rand.Intn(maxCount + 1)
			if randomCount > 0 {
				result[denom.name] = randomCount
				remaining -= randomCount * denom.value
			}
		}
	}

	// Use remaining as pennies
	if remaining > 0 {
		result["penny"] = remaining
	}

	return &ChangeResult{
		Denominations: result,
		Total:         float64(cents) / 100,
	}, nil
}

// FormatResult formats the change result as a human-readable string
func FormatResult(result *ChangeResult) string {
	if len(result.Denominations) == 0 {
		return ""
	}

	denomOrder := []string{"dollar", "quarter", "dime", "nickel", "penny"}
	var formatted string

	for i, name := range denomOrder {
		if count, exists := result.Denominations[name]; exists && count > 0 {
			if i > 0 {
				formatted += ","
			}
			plural := "s"
			if count == 1 {
				plural = ""
			}
			formatted += fmt.Sprintf("%d %s%s", count, name, plural)
		}
	}

	return formatted
}
