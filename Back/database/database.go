package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Глобальная переменная для работы с БД
var DB *gorm.DB

// Функция подключения к PostgreSQL
func Connect() {
	// Настроить свои данные
	dsn := "host=localhost user=postgres password=QWErty12# dbname=TestIKI_DB port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к базе данных:", err)
	}

	fmt.Println("✅ Успешное подключение к базе данных")
}
