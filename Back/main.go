package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"myproject/auth"
	"myproject/database"
	"myproject/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		_, err := auth.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		c.Next()
	}
}

func main() {
	// Инициализация логгера zap
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	// Загрузка .env файла
	if err := godotenv.Load(); err != nil {
		logger.Info("Warning: .env file not found")
	}

	// Проверка обязательных переменных окружения
	if os.Getenv("JWT_SECRET") == "" {
		logger.Fatal("JWT_SECRET environment variable is required")
	}

	// Инициализация БД
	database.Connect()
	database.AutoMigrate()

	// Настройка роутера Gin
	router := gin.Default()

	// Создаем совместимый с Gin логгер
	gin.DisableConsoleColor()
	gin.DefaultWriter = zap.NewStdLog(logger).Writer()

	// Middleware для логирования запросов
	router.Use(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		logger.Info("Request",
			zap.Int("status", c.Writer.Status()),
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.String("query", query),
			zap.String("ip", c.ClientIP()),
			zap.String("user-agent", c.Request.UserAgent()),
			zap.Duration("latency", time.Since(start)),
		)
	})

	// Настройка CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true, // Важно!
		MaxAge:           12 * time.Hour,
	}))

	// Публичные маршруты
	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)

	// Защищенные маршруты
	authGroup := router.Group("/")
	authGroup.Use(AuthMiddleware())
	{
		authGroup.GET("/me", handlers.GetCurrentUser)
	}

	// Запуск сервера
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.Info("Starting server",
		zap.String("port", port),
	)

	if err := router.Run(":" + port); err != nil {
		logger.Fatal("Failed to start server",
			zap.Error(err),
		)
	}
}
