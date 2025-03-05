package main

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
)

// Структура для пользователя
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email,omitempty"`
}

// Функция для проверки формата email
func isValidEmail(email string) bool {
	// Регулярное выражение для проверки email
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}

// Функция для проверки пароля (например, минимальная длина)
func isValidPassword(password string) bool {
	return len(password) >= 6 // Проверка на минимальную длину пароля
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

		// Проверка на пустые поля
		if user.Username == "" || user.Password == "" || user.Email == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Все поля обязательны для заполнения"})
			return
		}

		// Проверка на корректность email
		if !isValidEmail(user.Email) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат email"})
			return
		}

		// Проверка на корректность пароля
		if !isValidPassword(user.Password) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Пароль должен быть не менее 6 символов"})
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

		// Проверка на пустые поля
		if user.Username == "" || user.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Все поля обязательны для заполнения"})
			return
		}

		// Тут будет логика авторизации
		c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
	})

	// Запускаем сервер на порту 8080
	r.Run(":8080")
}
