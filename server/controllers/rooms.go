package controllers

import (
	"anonChat/db"
	"anonChat/models"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateRoom(c *gin.Context) {
	var req struct {
		Name        string `json:"name"`
		UserID      string `json:"user_id"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roomID := uuid.New()
	userUUID, err := uuid.Parse(req.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	_, err = db.Conn.Exec(context.Background(),
		`INSERT INTO rooms (id, name, description, created_by) VALUES ($1, $2, $3, $4)`,
		roomID, req.Name, req.Description, userUUID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = db.Conn.Exec(context.Background(),
		`INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)`,
		roomID, userUUID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Status:  "success",
		Message: "Room created successfully",
		Data:    map[string]string{"room_id": roomID.String(), "name": req.Name, "description": req.Description, "user_id": req.UserID},
	})
}

func JoinRoom(c *gin.Context) {
	var req struct {
		RoomID string `json:"room_id"`
		UserID string `json:"user_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roomUUID, err := uuid.Parse(req.RoomID)
	userUUID, err2 := uuid.Parse(req.UserID)
	if err != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid IDs"})
		return
	}

	_, err = db.Conn.Exec(context.Background(),
		`INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)
         ON CONFLICT (room_id, user_id) DO NOTHING`,
		roomUUID, userUUID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Joined room"})
}

func LeaveRoom(c *gin.Context) {
	var req struct {
		RoomID string `json:"room_id"`
		UserID string `json:"user_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Conn.Exec(context.Background(),
		`DELETE FROM room_members WHERE room_id = $1 AND user_id = $2`,
		req.RoomID, req.UserID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Left room"})
}
