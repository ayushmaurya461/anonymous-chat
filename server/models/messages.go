package models

import (
	"anonChat/db"
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Message struct {
	ID         uuid.UUID `json:"id"`
	SenderID   string    `json:"sender_id"`
	ReceiverID string    `json:"receiver_id,omitempty"` // optional for room chat
	RoomID     string    `json:"room_id,omitempty"`     // optional for one-to-one chat
	Content    string    `json:"content"`
	Type       string    `json:"type"` // chat_message, notification, typing, etc.
	CreatedAt  time.Time `json:"created_at"`
}

type WSMessage struct {
	Type       string `json:"type"`    // e.g., chat_message, typing, notification
	Content    string `json:"content"` // the actual message or event
	SenderID   string `json:"sender_id"`
	ReceiverID string `json:"receiver_id,omitempty"` // optional
	RoomID     string `json:"room_id,omitempty"`     // optional
	Timestamp  int64  `json:"timestamp"`             // Unix ms
}

type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan WSMessage
	Register   chan *Client
	Unregister chan *Client
}

type Client struct {
	ID       string // UID or DB ID
	UserName string
	UserID   string
	Conn     *websocket.Conn
	Send     chan []byte // Outgoing messages
	RoomID   string      // For group chats
}

func (c *Client) Read(hub *Hub) {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, raw, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		log.Printf("Raw message from frontend: %s\n", string(raw))

		var msg WSMessage
		if err := json.Unmarshal(raw, &msg); err != nil {
			log.Println("Invalid WSMessage format:", err)
			continue
		}

		dbMsg := Message{
			ID:         uuid.New(),
			SenderID:   c.UserID,
			ReceiverID: msg.ReceiverID,
			RoomID:     msg.RoomID,
			Content:    msg.Content,
			Type:       msg.Type,
			CreatedAt:  time.Now(),
		}

		if err := SaveMessageToDB(dbMsg); err != nil {
			log.Println("db save error:", err)
		}

		msg.SenderID = c.UserID

		hub.Broadcast <- msg
	}
}

func (c *Client) Write() {
	defer c.Conn.Close()

	for msg := range c.Send {
		err := c.Conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Printf("Write error: %v", err)
			break
		}
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
			h.BroadcastUserLists()
			log.Printf("Client registered: %s", client.ID)

		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
				log.Printf("Client unregistered: %s", client.ID)
			}

		case msg := <-h.Broadcast:
			for client := range h.Clients {
				// Private message
				if msg.ReceiverID != "" && msg.RoomID == "" {
					if client.UserID == msg.ReceiverID || client.UserID == msg.SenderID {
						b, _ := json.Marshal(msg)
						client.Send <- b
					}
				}

				// Room message
				if msg.RoomID != "" && msg.ReceiverID == "" {
					if client.RoomID == msg.RoomID {
						b, _ := json.Marshal(msg)
						client.Send <- b
					}
				}
			}
		}
	}
}

func (h *Hub) BroadcastUserLists() {
	var users []map[string]string

	for client := range h.Clients {
		users = append(users, map[string]string{
			"id":       client.ID,
			"username": client.UserName,
		})
	}

	payload, _ := json.Marshal(map[string]interface{}{
		"type": "users_list",
		"data": users,
	})

	for client := range h.Clients {
		client.Send <- payload
	}
}

func SaveMessageToDB(msg Message) error {
	var receiverID, roomID interface{}
	if msg.ReceiverID != "" {
		uid, err := uuid.Parse(msg.ReceiverID)
		if err == nil {
			receiverID = uid
		}
	}
	if msg.RoomID != "" {
		uid, err := uuid.Parse(msg.RoomID)
		if err == nil {
			roomID = uid
		}
	}

	_, err := db.Conn.Exec(context.Background(), `
    INSERT INTO messages (id, sender_id, receiver_id, room_id, content, type, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `,
		msg.ID, msg.SenderID, receiverID, roomID, msg.Content, msg.Type,
	)

	return err
}
