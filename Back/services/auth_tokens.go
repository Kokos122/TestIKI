package services // вместо package main

import (
	"crypto/rand"
	"encoding/hex"
	"time"
)

// Генерация случайного токена для восстановления пароля и верификации email
func GenerateRandomToken() (string, error) {
	bytes := make([]byte, 32) // 32 байта = 64 символа в hex
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// Проверка срока действия токена
func IsTokenExpired(expTime *time.Time) bool {
	if expTime == nil {
		return true
	}
	return time.Now().After(*expTime)
}

// Создание времени истечения токена (1 час от текущего времени)
func CreateTokenExpiration() time.Time {
	return time.Now().Add(1 * time.Hour)
}

// Создание времени истечения для email верификации (24 часа)
func CreateEmailVerificationExpiration() time.Time {
	return time.Now().Add(24 * time.Hour)
}
