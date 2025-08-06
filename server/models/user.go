package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID ` json:"id"`
	UID       string    ` json:"uid"` // for both guest/registered
	Name      string    ` json:"name"`
	Email     string    ` json:"email,omitempty"`    // only for registered
	Password  string    ` json:"password,omitempty"` // only for registered
	Type      string    ` json:"type"`               // "guest" or "registered"
	Status    string    ` json:"status"`             // "online" or "offline"
	CreatedAt time.Time ` json:"createdAt"`
}
