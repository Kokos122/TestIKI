package database

import "gorm.io/gorm"

// User - структура модели пользователя
type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
	Email    string `json:"email,omitempty" gorm:"unique"`
}

// AutoMigrate - автоматическое создание таблиц
func AutoMigrate() {
	DB.AutoMigrate(&User{})
}
