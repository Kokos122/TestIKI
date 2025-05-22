package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"myproject/auth"
	"myproject/cloudinary"
	"myproject/database"
	"net/http"
	"net/url"
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
	Username        string `json:"username" binding:"required"`
	Password        string `json:"password" binding:"required"`
	Email           string `json:"email" binding:"required"`
	ConfirmPassword string `json:"confirmPassword" binding:"required"`
}

type LoginRequest struct {
	Username     string `json:"username" binding:"required"`
	Password     string `json:"password" binding:"required"`
	CaptchaToken string `json:"captchaToken"`
}

type TestResultRequest struct {
	TestName   string `json:"test_name" binding:"required"`
	Score      int    `json:"score" binding:"required"`
	ResultText string `json:"result_text" binding:"required"`
}

type UpdateProfileRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
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
		return errors.New("password must contain uppercase, lowercase, number, and special character")
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

func VerifyCaptcha(token string) (bool, error) {
	resp, err := http.PostForm("https://www.google.com/recaptcha/api/siteverify", url.Values{
		"secret":   {os.Getenv("RECAPTCHA_SECRET_KEY")},
		"response": {token},
	})
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	var result struct {
		Success bool `json:"success"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}
	return result.Success, nil
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

	if req.Password != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}

	user := database.User{
		Username:      req.Username,
		Password:      req.Password,
		Email:         req.Email,
		LoginAttempts: 0,
		LockUntil:     nil,
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
	if c.Writer.Status() == http.StatusTooManyRequests {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many login attempts, try again later"})
		return
	}

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

	// Проверка блокировки
	if user.LockUntil != nil && time.Now().Before(*user.LockUntil) {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "Account is locked, try again later"})
		return
	}

	// Проверка капчи после 3 попыток
	if user.LoginAttempts >= 3 && req.CaptchaToken != "" {
		if valid, err := VerifyCaptcha(req.CaptchaToken); err != nil || !valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid CAPTCHA"})
			return
		}
	}

	// Проверка пароля
	if err := user.CheckPassword(req.Password); err != nil {
		// Увеличиваем счетчик попыток
		user.LoginAttempts++
		if user.LoginAttempts >= 5 {
			lockUntil := time.Now().Add(15 * time.Minute)
			user.LockUntil = &lockUntil
			user.LoginAttempts = 0
		}
		if err := database.DB.Save(&user).Error; err != nil {
			log.Printf("Database error: %v", err)
		}
		// Задержка ответа
		time.Sleep(2 * time.Second)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Сбрасываем счетчик попыток при успешном входе
	user.LoginAttempts = 0
	user.LockUntil = nil
	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Database error: %v", err)
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
			"avatar_url": user.AvatarURL,
		},
	})
}

// Остальные функции остаются без изменений
func GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	var user database.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"username":   user.Username,
		"email":      user.Email,
		"avatar_url": user.AvatarURL,
		"created_at": user.CreatedAt.Format(time.RFC3339),
	})
}

func UploadAvatar(c *gin.Context) {
	username := c.MustGet("username").(string)

	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

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

	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	cloudinaryService, err := cloudinary.New(cloudName, apiKey, apiSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	if user.AvatarURL != "" && user.AvatarURL != "/images/default-avatar.png" {
		publicID := cloudinary.ExtractPublicID(user.AvatarURL)
		if publicID != "" {
			_, err := cloudinaryService.Cld.Upload.Destroy(c.Request.Context(), uploader.DestroyParams{
				PublicID: publicID,
			})
			if err != nil {
				log.Printf("Failed to delete old avatar: %v", err)
			}
		}
	}

	avatarURL, err := cloudinaryService.UploadAvatar(
		c.Request.Context(),
		file,
		username,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload failed: " + err.Error()})
		return
	}

	if err := database.DB.Model(&user).Update("avatar_url", avatarURL).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"avatar_url": avatarURL})
}

func UpdateAvatar(c *gin.Context) {
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

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

	if !strings.HasPrefix(req.AvatarURL, "https://res.cloudinary.com/") {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Only Cloudinary URLs are allowed",
		})
		return
	}

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

	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// 2. Если аватар уже дефолтный, ничего не делаем
	if user.AvatarURL == "" || user.AvatarURL == "https://res.cloudinary.com/dbynlpzwa/image/upload/t_default/v1747240081/default_n0gsmv.png" {
		c.JSON(http.StatusOK, gin.H{"message": "Avatar already removed"})
		return
	}

	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	cloudinaryService, err := cloudinary.New(cloudName, apiKey, apiSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

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
	if err := database.DB.Model(&user).Update("avatar_url", "https://res.cloudinary.com/dbynlpzwa/image/upload/t_default/v1747240081/default_n0gsmv.png").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Avatar removed successfully", "avatar_url": "https://res.cloudinary.com/dbynlpzwa/image/upload/t_default/v1747240081/default_n0gsmv.png"})
}

func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}

func GetTests(c *gin.Context) {
	var tests []database.Test
	if err := database.DB.Where("is_active = ?", true).Find(&tests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tests"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tests": tests})
}

func GetTest(c *gin.Context) {
	slug := c.Param("slug")

	var test database.Test
	result := database.DB.Table("tests").Where("slug = ? AND is_active = ?", slug, true).First(&test)

	if result.Error != nil {
		log.Printf("Error fetching test: %v", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"error": "Test not found"})
		return
	}
	log.Printf("Found test: %+v", test)
	c.JSON(http.StatusOK, gin.H{"test": test})
}

func SaveTestResult(c *gin.Context) {
	fmt.Println("📩 Запрос на сохранение теста получен")

	usernameAny, exists := c.Get("username")
	if !exists {
		fmt.Println("❌ Username не найден в контексте")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	username := usernameAny.(string)

	var req struct {
		TestSlug   string                 `json:"test_slug" binding:"required"` // Изменено с test_id
		TestName   string                 `json:"test_name" binding:"required"`
		Score      int                    `json:"score"`
		ResultText string                 `json:"result_text"`
		Answers    map[string]interface{} `json:"answers"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println("❌ Ошибка биндинга JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Проверка данных вручную
	if req.TestSlug == "" || req.TestName == "" || req.ResultText == "" {
		fmt.Println("⚠️ Недостаточно данных:", req)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Недостаточно данных для сохранения"})
		return
	}

	// Получаем test_id по slug
	var test database.Test
	if err := database.DB.Where("slug = ?", req.TestSlug).First(&test).Error; err != nil {
		fmt.Println("❌ Тест не найден:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Test not found"})
		return
	}

	fmt.Printf("📦 Данные запроса:\nTestSlug: %v\nTestName: %s\nScore: %d\nResult: %s\nAnswers: %#v\n",
		req.TestSlug, req.TestName, req.Score, req.ResultText, req.Answers)

	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		fmt.Println("❌ Пользователь не найден:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	answersJSON, err := json.Marshal(req.Answers)
	if err != nil {
		fmt.Println("❌ Ошибка сериализации answers:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not process answers"})
		return
	}

	fmt.Println("✅ Answers JSON:", string(answersJSON))

	testResult := database.TestResult{
		UserID:      user.ID,
		TestID:      test.ID, // Используем test.ID
		TestName:    req.TestName,
		Score:       req.Score,
		ResultText:  req.ResultText,
		Answers:     answersJSON,
		CompletedAt: time.Now(),
		Category:    test.Category,
	}

	fmt.Println("💾 Сохраняем результат:")
	fmt.Printf("UserID: %v\nTestID: %v\nScore: %d\nText: %s\n", user.ID, test.ID, req.Score, req.ResultText)

	if err := database.DB.Create(&testResult).Error; err != nil {
		fmt.Println("❌ Ошибка при сохранении в БД:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save test result"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Test result saved successfully",
		"result": gin.H{
			"id":          testResult.ID,
			"test_id":     testResult.TestID,
			"score":       testResult.Score,
			"result_text": testResult.ResultText,
		},
	})
}

// Получение результатов тестов для профиля
// handlers.go
func GetUserTestResults(c *gin.Context) {
	username := c.MustGet("username").(string)

	// Находим пользователя по имени
	var user database.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Получаем результаты тестов из test_results, включая category
	var testResults []database.TestResult
	err := database.DB.
		Where("user_id = ?", user.ID).
		Order("completed_at DESC").
		Find(&testResults).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch test results"})
		return
	}

	// Возвращаем результаты
	c.JSON(http.StatusOK, gin.H{
		"test_results": testResults,
	})
}

// UpdateProfile handles updating the user's profile
func UpdateProfile(c *gin.Context) {
	// Get userID from context (set by AuthMiddleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Parse request body
	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	// Find the user in the database
	var user database.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update user fields
	user.Username = req.Username
	user.Email = req.Email

	// Save changes to the database
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	// Return updated user data
	c.JSON(http.StatusOK, gin.H{
		"username":   user.Username,
		"email":      user.Email,
		"created_at": user.CreatedAt.Format(time.RFC3339),
	})
}
