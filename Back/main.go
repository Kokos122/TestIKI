package main

import (
	"errors"
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
	"gorm.io/gorm"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		var user database.User
		if err := database.DB.Where("username = ?", claims.Username).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
				return
			}
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "database error"})
			return
		}

		c.Set("username", claims.Username)
		c.Set("userID", user.ID)
		c.Next()
	}
}

func main() {
	// Логгер
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer func() {
		if err := logger.Sync(); err != nil {
			log.Printf("Failed to sync logger: %v", err)
		}
	}()

	// Загрузка .env
	if err := godotenv.Load(); err != nil {
		logger.Info("Warning: .env file not found")
	}

	// Проверка переменных окружения
	requiredEnvVars := []string{"JWT_SECRET", "DATABASE_URL"}
	for _, envVar := range requiredEnvVars {
		if os.Getenv(envVar) == "" {
			logger.Fatal("Required environment variable is missing", zap.String("variable", envVar))
		}
	}

	if os.Getenv("ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Подключение к БД и миграции
	database.Connect()
	database.AutoMigrate()

	// Инициализация Gin
	router := gin.New()

	// Middleware паники
	router.Use(gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		logger.Error("Panic occurred",
			zap.Any("error", recovered),
			zap.String("path", c.Request.URL.Path),
		)
		c.AbortWithStatus(http.StatusInternalServerError)
	}))

	// Логирование
	router.Use(func(c *gin.Context) {
		start := time.Now()
		c.Next()
		logger.Info("Request",
			zap.Int("status", c.Writer.Status()),
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.String("query", c.Request.URL.RawQuery),
			zap.String("ip", c.ClientIP()),
			zap.String("user-agent", c.Request.UserAgent()),
			zap.Duration("latency", time.Since(start)),
		)
	})

	// CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://testiki-33ur.onrender.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Статика
	router.Static("/static", "./public/static")

	// Публичные маршруты
	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)
	router.POST("/logout", handlers.Logout)

	// Приватные маршруты
	authGroup := router.Group("/")
	authGroup.Use(AuthMiddleware())
	{
		authGroup.GET("/me", handlers.GetCurrentUser)
		authGroup.POST("/test-result", handlers.SaveTestResult)
		authGroup.POST("/upload-avatar", handlers.UploadAvatar)
		authGroup.POST("/update-avatar", handlers.UpdateAvatar)
		authGroup.DELETE("/avatar", handlers.DeleteAvatar)
	}

	// SPA маршруты
	router.NoRoute(func(c *gin.Context) {
		c.File("./public/index.html")
	})

	// Запуск сервера
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	logger.Info("Starting server", zap.String("port", port), zap.String("environment", os.Getenv("ENV")))

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}
