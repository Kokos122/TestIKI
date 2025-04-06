package database

import (
	"errors"

	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username    string       `json:"username" gorm:"unique;not null"`
	Password    string       `json:"-" gorm:"not null"`
	Email       string       `json:"email" gorm:"unique;not null"`
	IsVerified  bool         `json:"is_verified" gorm:"default:false"`
	VerifyToken string       `json:"-"`
	AvatarURL   string       `json:"avatar_url" gorm:"default:'/images/default-avatar.png'"`
	TestResults []TestResult `json:"test_results" gorm:"foreignKey:UserID"`
}

type TestResult struct {
	gorm.Model
	UserID      uint      `json:"user_id"`
	TestName    string    `json:"test_name"`
	Score       int       `json:"score"`
	ResultText  string    `json:"result_text"`
	CompletedAt time.Time `json:"completed_at"`
}

func (u *User) HashPassword() error {
	if len(u.Password) == 0 {
		return errors.New("password cannot be empty")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}
