package models

type APIResponse struct {
	Status  string      `json:"status"`            // e.g. "success" or "error"
	Message string      `json:"message,omitempty"` // Optional message
	Data    interface{} `json:"data,omitempty"`    // Payload (optional)
	Error   string      `json:"error,omitempty"`   // Error message (if any)
}
