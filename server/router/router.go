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

	g.GET("/messages", func(c *gin.Context) {
		controllers.GetMessages(c.Writer, c.Request)
	})

	g.GET("/ws", func(c *gin.Context) {
		ws.HandleWebSocket(hub, c.Writer, c.Request)
	})

}
