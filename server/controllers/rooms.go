package controllers

import (
	"anonChat/db"
	"anonChat/models"
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func CreateRoom(c *gin.Context) {
	var req struct {
		Name        string   `json:"name"`
		UserID      string   `json:"user_id"`
		Tags        []string `json:"tags"`
		Description string   `json:"description"`
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
		`INSERT INTO rooms (id, name, description, created_by, tags) VALUES ($1, $2, $3, $4, $5)`,
		roomID, req.Name, req.Description, userUUID, req.Tags,
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

func GetRooms(c *gin.Context) {
	userID := c.Param("user_id")

	userUUID, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{Error: "Invalid user ID", Status: "error"})
		return
	}

	query := `SELECT r.id, r.name FROM rooms r JOIN room_members rm ON r.id = rm.room_id WHERE rm.user_id = $1`

	rows, err := db.Conn.Query(context.Background(), query, userUUID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  err.Error(),
		})
		return
	}

	defer rows.Close()

	var rooms []models.Room

	for rows.Next() {
		var room models.Room
		err := rows.Scan(&room.ID, &room.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.APIResponse{
				Status: "error",
				Error:  err.Error(),
			})
			return
		}
		rooms = append(rooms, room)
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Status: "success",
		Data:   rooms,
	})

}

func SearchRoom(c *gin.Context) {
	name := c.Query("query")
	tagsParam := c.Query("tags") // comma-separated tags

	var query string
	var rows pgx.Rows
	var err error

	if tagsParam != "" {
		tags := strings.Split(tagsParam, ",") // []string
		query = `SELECT id, name, description, created_by, tags
                 FROM rooms
                 WHERE name ILIKE '%' || $1 || '%'
                 AND tags && $2::text[];`
		rows, err = db.Conn.Query(context.Background(), query, name, tags)
	} else {
		query = `SELECT id, name, description, created_by, tags
                 FROM rooms
                 WHERE name ILIKE '%' || $1 || '%';`
		rows, err = db.Conn.Query(context.Background(), query, name)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  err.Error(),
		})
		return
	}
	defer rows.Close()

	var rooms []models.Room
	for rows.Next() {
		var room models.Room
		err := rows.Scan(&room.ID, &room.Name, &room.Description, &room.CreatedBy, &room.Tags)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.APIResponse{
				Status: "error",
				Error:  err.Error(),
			})
			return
		}
		rooms = append(rooms, room)
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Status: "success",
		Data:   rooms,
	})
}
