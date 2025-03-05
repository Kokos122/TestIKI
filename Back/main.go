package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Структура для пользователя
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func main() {
	// Создаем роутер
	r := gin.Default()

	// Роут для регистрации пользователя
	r.POST("/register", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Тут будет логика сохранения пользователя
		c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
	})

	// Роут для авторизации
	r.POST("/login", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Тут будет логика авторизации
		c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
	})

	// Запускаем сервер на порту 8080
	r.Run(":8080")
}
