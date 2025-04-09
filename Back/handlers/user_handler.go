package handlers

import (
	"errors"
	"log"
	"myproject/auth"
	"myproject/cloudinary"
	"myproject/database"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
	"unicode"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type TestResultRequest struct {
	TestName   string `json:"test_name" binding:"required"`
	Score      int    `json:"score" binding:"required"`
	ResultText string `json:"result_text" binding:"required"`
}

func validatePassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters")
	}

	var (
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	if !hasUpper || !hasLower || !hasNumber || !hasSpecial {
		return errors.New("password must contain uppercase, lowercase, number and special character")
	}
	return nil
}

func isValidEmail(email string) bool {
	if len(email) > 254 {
		return false
	}

	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !re.MatchString(email) {
		return false
	}

	parts := strings.Split(email, "@")
	return len(parts[0]) <= 64
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	if !isValidEmail(req.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	if err := validatePassword(req.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := database.User{
		Username: req.Username,
		Password: req.Password,
		Email:    req.Email,
	}

	if err := user.HashPassword(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not process password"})
		return
	}

	if err := database.DB.Create(&user).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Username or email already exists"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	var user database.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	if err := user.CheckPassword(req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := auth.GenerateToken(user.Username)
	if err != nil {
		log.Printf("Token generation error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"avatar_url": user.AvatarURL, // Добавлено поле avatar_url
		},
	})
}

func GetCurrentUser(c *gin.Context) {
	username := c.MustGet("username").(string)

	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"avatar_url": user.AvatarURL, // Добавлено поле avatar_url
		},
	})
}

func SaveTestResult(c *gin.Context) {
	username := c.MustGet("username").(string)
	var req TestResultRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	testResult := database.TestResult{
		UserID:      user.ID,
		TestName:    req.TestName,
		Score:       req.Score,
		ResultText:  req.ResultText,
		CompletedAt: time.Now(),
	}

	if err := database.DB.Create(&testResult).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save test result"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Test result saved successfully"})
}

func UploadAvatar(c *gin.Context) {
	username := c.MustGet("username").(string)

	// 1. Получаем текущего пользователя
	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// 2. Получаем файл
	fileHeader, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot read file"})
		return
	}
	defer file.Close()

	// 3. Инициализируем Cloudinary
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	cloudinaryService, err := cloudinary.New(cloudName, apiKey, apiSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	// 4. Если у пользователя уже есть аватар (не дефолтный), удаляем старый
	if user.AvatarURL != "" && user.AvatarURL != "/images/default-avatar.png" {
		publicID := cloudinary.ExtractPublicID(user.AvatarURL)
		if publicID != "" {
			_, err := cloudinaryService.Cld.Upload.Destroy(c.Request.Context(), uploader.DestroyParams{
				PublicID: publicID,
			})
			if err != nil {
				log.Printf("Failed to delete old avatar: %v", err)
				// Продолжаем в любом случае
			}
		}
	}

	// 5. Загружаем новый файл
	avatarURL, err := cloudinaryService.UploadAvatar(
		c.Request.Context(),
		file,
		username, // Используем username как идентификатор
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload failed: " + err.Error()})
		return
	}

	// 6. Сохраняем URL в БД
	if err := database.DB.Model(&user).Update("avatar_url", avatarURL).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"avatar_url": avatarURL})
}
func UpdateAvatar(c *gin.Context) {
	// Получаем username из контекста (установлен в AuthMiddleware)
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Валидация входных данных
	var req struct {
		AvatarURL string `json:"avatar_url" binding:"required,url"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Invalid request data: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	// Проверка URL (дополнительная валидация)
	if !strings.HasPrefix(req.AvatarURL, "https://res.cloudinary.com/") {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Only Cloudinary URLs are allowed",
		})
		return
	}

	// Обновление в базе данных
	result := database.DB.Model(&database.User{}).
		Where("username = ?", username).
		Update("avatar_url", req.AvatarURL)

	if result.Error != nil {
		log.Printf("Database error: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update avatar",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	log.Printf("Avatar updated for user: %s", username)
	c.JSON(http.StatusOK, gin.H{
		"message":    "Avatar updated successfully",
		"avatar_url": req.AvatarURL,
	})
}
func DeleteAvatar(c *gin.Context) {
	username := c.MustGet("username").(string)

	// 1. Получаем текущего пользователя
	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// 2. Если аватар уже дефолтный, ничего не делаем
	if user.AvatarURL == "" || user.AvatarURL == "/images/default-avatar.png" {
		c.JSON(http.StatusOK, gin.H{"message": "Avatar already removed"})
		return
	}

	// 3. Инициализируем Cloudinary
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	cloudinaryService, err := cloudinary.New(cloudName, apiKey, apiSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	// 4. Удаляем аватар из Cloudinary
	publicID := cloudinary.ExtractPublicID(user.AvatarURL)
	if publicID != "" {
		_, err := cloudinaryService.Cld.Upload.Destroy(c.Request.Context(), uploader.DestroyParams{
			PublicID: publicID,
		})
		if err != nil {
			log.Printf("Failed to delete avatar: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete avatar from storage"})
			return
		}
	}

	// 5. Устанавливаем дефолтный аватар в БД
	if err := database.DB.Model(&user).Update("avatar_url", "/images/default-avatar.png").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Avatar removed successfully", "avatar_url": "/images/default-avatar.png"})
}

func Logout(c *gin.Context) {
	// Здесь можно добавить логику инвалидации токена, если нужно
	c.JSON(http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}
