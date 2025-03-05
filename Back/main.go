package main

import (
	"fmt"
	"log"
	"myproject/database"
	"myproject/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// Подключение к базе данных
	database.Connect()
	database.AutoMigrate()

	// Создание роутера
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	})

	// Роуты
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	fmt.Println("🚀 Сервер запущен на http://localhost:8080")
	log.Fatal(r.Run(":8080"))
}
