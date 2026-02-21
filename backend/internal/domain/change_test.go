package domain

import (
	"math"
	"testing"
)

func TestCalculateChange_Table(t *testing.T) {
	tests := []struct {
		name       string
		owed       float64
		paid       float64
		divisor    int
		country    string
		special    []string
		expectRand bool
		wantTotal  float64
	}{
		{
			name:       "Minimum change, divisor 3, not divisible",
			owed:       2.13,
			paid:       3.00,
			divisor:    3,
			country:    "US",
			special:    []string{},
			expectRand: false,
			wantTotal:  0.87,
		},
		{
			name:       "Randomized change, divisor 7, divisible",
			owed:       2.00,
			paid:       3.05,
			divisor:    7,
			country:    "US",
			special:    []string{},
			expectRand: true,
			wantTotal:  1.05,
		},
		{
			name:       "Minimum change, divisor 5, not divisible",
			owed:       1.00,
			paid:       1.99,
			divisor:    5,
			country:    "US",
			special:    []string{},
			expectRand: false,
			wantTotal:  0.99,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := ChangeRequest{
				AmountOwed: tt.owed,
				AmountPaid: tt.paid,
			}
			// Calculate original change cents
			origChange := req.AmountPaid - req.AmountOwed
			origCents := int(math.Round(origChange * 100))
			shouldRandomize := origCents%tt.divisor == 0

			result, err := CalculateChange(req, tt.divisor, tt.country, tt.special)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if math.Abs(result.Total-tt.wantTotal) > 0.001 {
				t.Errorf("want total %.2f, got %.2f", tt.wantTotal, result.Total)
			}
			// Compare denominations with greedy minimum change
			greedy := minimumChange(origCents)
			isGreedy := true
			for k, v := range greedy.Denominations {
				if result.Denominations[k] != v {
					isGreedy = false
					break
				}
			}
			if shouldRandomize {
				if isGreedy {
					t.Errorf("expected randomized change, got greedy result: divisor=%d, origCents=%d", tt.divisor, origCents)
				}
			} else {
				if !isGreedy {
					t.Errorf("expected greedy minimum change, got randomized result: divisor=%d, origCents=%d", tt.divisor, origCents)
				}
			}
		})
	}
}
