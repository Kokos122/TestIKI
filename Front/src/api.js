// Создаем новый файл api.js для централизованной настройки axios
import axios from "axios"

// Определяем базовый URL в зависимости от окружения
const getBaseUrl = () => {
  // Если приложение запущено на Vercel, используем URL вашего бэкенда
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return "https://testiki-33ur.onrender.com" // URL вашего задеплоенного бэкенда
  }
  // Иначе используем локальный URL
  return "http://localhost:8080"
}

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 10000,
})

// Добавьте в api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Перенаправление на страницу входа или открытие модального окна
      console.log("Ошибка аутентификации, требуется вход")
      // Можно вызвать функцию для открытия модального окна или перенаправления
    }
    return Promise.reject(error)
  }
)

export default api
