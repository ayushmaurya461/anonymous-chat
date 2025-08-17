package ws

import (
	"anonChat/db"
	"anonChat/models"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

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
		log.Println("Missing user_id, closing WS")
		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, "Missing user_id"))
		conn.Close()
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	username := db.GetUsernameByID(ctx, userID)
	roomID := r.URL.Query().Get("room_id")

	fmt.Println("Username:", username, r.URL.Query())
	if username == "" {
		log.Println("No username found, closing WS")
		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "User not found"))
		conn.Close()
		return
	}
	client := &models.Client{
		ID:       uuid.New().String(),
		UserID:   userID,
		UserName: username,
		Conn:     conn,
		Send:     make(chan []byte, 256),
		RoomID:   roomID,
	}

	hub.Register <- client

	go client.Read(hub)
	go client.Write()

}
