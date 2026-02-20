package http

import (
	"encoding/json"
	"net/http"
	"sync"
)

type Config struct {
	RandomDivisor int      `json:"randomDivisor"`
	Country       string   `json:"country"`
	SpecialCases  []string `json:"specialCases"`
}

var (
	config     = Config{RandomDivisor: 3, Country: "US", SpecialCases: []string{}}
	configLock sync.RWMutex
)

func HandleGetConfig(w http.ResponseWriter, r *http.Request) {
	configLock.RLock()
	defer configLock.RUnlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func HandleSetConfig(w http.ResponseWriter, r *http.Request) {
	var newConfig Config
	if err := json.NewDecoder(r.Body).Decode(&newConfig); err != nil {
		http.Error(w, "Invalid config", http.StatusBadRequest)
		return
	}
	configLock.Lock()
	config = newConfig
	configLock.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}
