package router

import (
	"anonChat/controllers"
	"anonChat/internal/ws"
	"anonChat/models"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(g *gin.Engine, hub *models.Hub) {
	api := g.Group("/api")
	api.POST("/register", controllers.Register)
	api.POST("/login", controllers.Login)
	api.POST("/guest", controllers.GuestLogin)

	user := g.Group("/user")
	user.GET("/:id", controllers.GetUser)
	user.GET("/users/:id", controllers.GetUsers)
	user.GET("messages", func(c *gin.Context) {
		controllers.GetMessages(c.Writer, c.Request)
	})
	user.POST("/mark-read", func(c *gin.Context) {
		controllers.MarkAsRead(c.Writer, c.Request)
	})

	rooms := g.Group("/rooms")
	rooms.POST("/create", controllers.CreateRoom)
	rooms.POST("/join", controllers.JoinRoom)
	rooms.POST("/leave", controllers.LeaveRoom)

	g.GET("/ws", func(c *gin.Context) {
		ws.HandleWebSocket(hub, c.Writer, c.Request)
	})

}
