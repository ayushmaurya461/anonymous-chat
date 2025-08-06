package main

import (
	"anonChat/db"
	"anonChat/router"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
}

func main() {
	g := gin.Default()
	g.Use(gin.Logger())
	g.Use(gin.Recovery())
	g.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
	}))
	err := g.SetTrustedProxies([]string{"127.0.0.1"})
	if err != nil {
		panic(err)
	}

	if err := db.ConnectDB(); err != nil {
		panic(err)
	}

	router.SetupRoutes(g)

	g.Run(":8080")

}
