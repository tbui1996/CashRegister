package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	httpAdapter "github.com/tbui1996/cash-register/internal/adapters/http"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := mux.NewRouter()
	handler := httpAdapter.NewHandler()

	// Routes
	router.HandleFunc("/api/change", handler.HandleCalculateChange).Methods(http.MethodPost)
	router.HandleFunc("/api/change/batch", handler.HandleBatchCalculate).Methods(http.MethodPost)
	router.HandleFunc("/api/change/file", handler.HandleFileUpload).Methods(http.MethodPost)
	router.HandleFunc("/api/config", httpAdapter.HandleGetConfig).Methods(http.MethodGet)
	router.HandleFunc("/api/config", httpAdapter.HandleSetConfig).Methods(http.MethodPost)
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"healthy"}`)
	}).Methods(http.MethodGet)

	// CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{http.MethodGet, http.MethodPost, http.MethodOptions}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)(router)

	log.Printf("Starting server on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}
