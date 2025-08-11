package ws

import (
	"anonChat/db"
	"anonChat/models"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocket(hub *models.Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}

	log.Println("WebSocket connection established")

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "Missing user_id", http.StatusBadRequest)
		return
	}
	username := db.GetUsernameByID(userID)

	client := &models.Client{
		ID:       uuid.New().String(),
		UserID:   userID,
		UserName: username,
		Conn:     conn,
		Send:     make(chan []byte, 256),
		RoomID:   "",
	}

	hub.Register <- client

	go client.Read(hub)
	go client.Write()

}
