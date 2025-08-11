package controllers

import (
	"anonChat/db"
	"anonChat/models"
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(g *gin.Context) {
	var req models.SignupRequest

	if err := g.ShouldBindJSON(&req); err != nil {
		g.JSON(http.StatusBadRequest, models.APIResponse{
			Status: "error",
			Error:  "Invalid request: " + err.Error(),
		})
		return
	}
	name := strings.TrimSpace(req.Username)
	password := req.Password
	email := req.Email

	var exists bool

	checkQuery := `SELECT EXISTS(SELECT 1 FROM users WHERE name = $1)`

	err := db.Conn.QueryRow(context.Background(), checkQuery, name).Scan(&exists)
	if err != nil {
		g.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  "Database error while checking username: " + err.Error(),
		})
		return
	}

	if exists {
		g.JSON(http.StatusConflict, models.APIResponse{
			Status: "error",
			Error:  "Username is already taken",
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		g.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  err.Error(),
		})
		return
	}

	id := uuid.New()
	uid := uuid.New().String()

	user := models.User{
		ID:        id,
		UID:       uid,
		Name:      name,
		Email:     email,
		Status:    "online",
		CreatedAt: time.Now(),
		Type:      "user",
	}

	query := `
		INSERT INTO users (id, uid, name, email, password, type, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`

	_, err = db.Conn.Exec(context.Background(), query, id, uid, name, email, hashedPassword, "user", "online", time.Now())

	if err != nil {
		g.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  "Failed to create user: " + err.Error(),
		})
		return
	}

	g.JSON(http.StatusCreated, models.APIResponse{
		Status:  "success",
		Message: "User registered successfully",
		Data:    user,
	})
}

func Login(g *gin.Context) {
	var req models.LoginRequest

	if err := g.ShouldBindJSON(&req); err != nil {
		g.JSON(http.StatusBadRequest, models.APIResponse{
			Status: "error",
			Error:  "Invalid request: " + err.Error(),
		})
		return
	}

	var user models.User

	query := `SELECT id,uid,email,name,password,type, status, created_at FROM users WHERE name = $1`
	err := db.Conn.QueryRow(context.Background(), query, req.Username).Scan(
		&user.ID,
		&user.UID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Type,
		&user.Status,
		&user.CreatedAt,
	)

	if err != nil {
		g.JSON(http.StatusUnauthorized, models.APIResponse{
			Status: "error",
			Error:  "Invalid username or password",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))

	if err != nil {
		g.JSON(http.StatusUnauthorized, models.APIResponse{
			Status: "error",
			Error:  "Invalid username or password",
		})
		return
	}

	update := `UPDATE users SET status = 'online' WHERE id = $1`
	_, _ = db.Conn.Exec(context.Background(), update, user.ID)

	user.Password = ""
	g.JSON(http.StatusOK, models.APIResponse{
		Status:  "success",
		Data:    user,
		Message: "User logged in successfully",
	})

}

func GuestLogin(g *gin.Context) {
	user := models.User{
		ID:        uuid.New(),
		UID:       uuid.New().String(),
		Name:      "Guest_" + uuid.New().String()[:6],
		Type:      "guest",
		Status:    "online",
		CreatedAt: time.Now(),
	}

	query := `
		INSERT INTO users (id, uid, name, type, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	_, err := db.Conn.Exec(context.Background(), query, user.ID, user.UID, user.Name, user.Type, user.Status, user.CreatedAt)

	if err != nil {
		g.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  err.Error(),
		})
		return
	}

	g.JSON(http.StatusOK, models.APIResponse{
		Status: "success",
		Data:   user,
	})
}

func GetUser(g *gin.Context) {
	id := g.Param("id")

	var user models.User
	query := `SELECT id, uid, name, email, type, status, created_at FROM users WHERE id = $1`
	err := db.Conn.QueryRow(context.Background(), query, id).Scan(
		&user.ID,
		&user.UID,
		&user.Name,
		&user.Email,
		&user.Type,
		&user.Status,
		&user.CreatedAt,
	)

	if err != nil {
		g.JSON(http.StatusNotFound, models.APIResponse{
			Status: "error",
			Error:  "User not found",
		})
		return
	}

	g.JSON(http.StatusOK, models.APIResponse{
		Status: "success",
		Data:   user,
	})

}

func GetUsers(g *gin.Context) {
	id := g.Param("id")

	var users []models.User
	query := `SELECT id, uid, name, email, type, status, created_at 
			  FROM users 
			  WHERE id != $1
			  ORDER BY created_at DESC`

	rows, err := db.Conn.Query(context.Background(), query, id)
	if err != nil {
		g.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  "Failed to fetch users: " + err.Error(),
		})
		return
	}

	defer rows.Close()

	for rows.Next() {
		var user models.User
		if err := rows.Scan(
			&user.ID,
			&user.UID,
			&user.Name,
			&user.Email,
			&user.Type,
			&user.Status,
			&user.CreatedAt,
		); err != nil {
			g.JSON(http.StatusInternalServerError, models.APIResponse{
				Status: "error",
				Error:  "Failed to scan user",
			})
			return
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		g.JSON(http.StatusInternalServerError, models.APIResponse{
			Status: "error",
			Error:  "Error iterating users",
		})
		return
	}

	g.JSON(http.StatusOK, models.APIResponse{
		Status: "success",
		Data:   users,
	})

}
