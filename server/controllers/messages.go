package controllers

import (
	"anonChat/db"
	"anonChat/models"
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"
)

func GetMessages(w http.ResponseWriter, r *http.Request) {
	queryType := r.URL.Query().Get("type")
	currentUserID := r.URL.Query().Get("c_user_id")
	limit := 50
	offset := 0

	var rows pgx.Rows
	var err error

	switch queryType {
	case "user":
		otherUserID := r.URL.Query().Get("user_id")
		rows, err = db.Conn.Query(context.Background(), `
            SELECT id, sender_id, receiver_id, room_id, content, type, created_at
            FROM messages
            WHERE 
              (sender_id = $1 AND receiver_id = $2)
              OR (sender_id = $2 AND receiver_id = $1)
            ORDER BY created_at
            LIMIT $3 OFFSET $4
        `, currentUserID, otherUserID, limit, offset)

	case "room":
		roomID := r.URL.Query().Get("room_id")
		rows, err = db.Conn.Query(context.Background(), `
            SELECT id, sender_id, receiver_id, room_id, content, type, created_at
            FROM messages
            WHERE room_id = $1
            ORDER BY created_at
            LIMIT $2 OFFSET $3
        `, roomID, limit, offset)

	default:
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.APIResponse{
			Status:  "error",
			Message: "Invalid type parameter",
		})
		return
	}

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.APIResponse{
			Status: "error",
			Error:  err.Error(),
		})
		return
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var msg models.Message
		var receiverID sql.NullString
		var roomID sql.NullString

		if err := rows.Scan(
			&msg.ID,
			&msg.SenderID,
			&receiverID,
			&roomID,
			&msg.Content,
			&msg.Type,
			&msg.CreatedAt,
		); err != nil {
			log.Println("scan error:", err)
			continue
		}

		if receiverID.Valid {
			msg.ReceiverID = receiverID.String
		}
		if roomID.Valid {
			msg.RoomID = roomID.String
		}

		messages = append(messages, msg)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.APIResponse{
		Status:  "success",
		Message: "Messages fetched successfully",
		Data:    messages,
	})
}

func MarkAsRead(w http.ResponseWriter, r *http.Request) {
	query := `UPDATE messages SET read = true WHERE receiver_id = $1 AND read = false`
	_, err := db.Conn.Exec(context.Background(), query, r.URL.Query().Get("user_id"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.APIResponse{
			Status:  "error",
			Message: "Failed to mark messages as read",
		})
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.APIResponse{
		Status:  "success",
		Message: "Messages marked as read successfully",
	})

}
