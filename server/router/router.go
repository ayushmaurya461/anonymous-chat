package router

import (
	"anonChat/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(g *gin.Engine) {
	api := g.Group("/api")
	api.POST("/register", controllers.Register)
	api.POST("/login", controllers.Login)
	api.POST("/guest", controllers.GuestLogin)

}
