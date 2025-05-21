import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { SlSocialVkontakte } from "react-icons/sl";
import { SiTelegram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

// Функция для проверки email
const isValidEmail = (email) => {
  if (email.length > 254) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return false;
  const [localPart] = email.split("@");
  return localPart.length <= 64;
};

// Функция для проверки пароля
const validatePassword = (password) => {
  if (password.length < 8) {
    return "Пароль должен быть минимум 8 символов";
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return "Пароль должен содержать заглавные, строчные буквы, цифры и спецсимволы";
  }
  return "";
};

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleSocialAuth = (provider) => {
    alert(`Быстрый вход через ${provider} в разработке`);
  };

  const handleAuth = async () => {
    setIsLoading(true);
    setError("");

    // Проверка на пустые поля
    if (!username || !password) {
      setError("Все поля обязательны!");
      setIsLoading(false);
      return;
    }

    if (isRegister) {
      if (!email) {
        setError("Email обязателен!");
        setIsLoading(false);
        return;
      }

      if (!confirmPassword) {
        setError("Подтвердите пароль!");
        setIsLoading(false);
        return;
      }

      // Валидация email
      if (!isValidEmail(email)) {
        setError("Неверный формат email!");
        setIsLoading(false);
        return;
      }

      // Валидация пароля
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        setIsLoading(false);
        return;
      }

      // Проверка совпадения паролей
      if (password !== confirmPassword) {
        setError("Пароли не совпадают!");
        setIsLoading(false);
        return;
      }
    }

    if (showCaptcha && !captchaToken) {
      setError("Пройдите проверку CAPTCHA!");
      setIsLoading(false);
      return;
    }

    const url = isRegister ? "http://localhost:8080/register" : "http://localhost:8080/login";
    const data = { username, password, ...(isRegister && { email, confirmPassword }), captchaToken };

    try {
      const response = await axios.post(url, data);
      if (isRegister) {
        setError("Регистрация успешна! Войдите.");
        setIsRegister(false);
      } else {
        onLoginSuccess(response.data.token, response.data.user);
        setAttempts(0);
        setShowCaptcha(false);
      }
    } catch (error) {
      setAttempts(attempts + 1);
      if (attempts + 1 >= 3) {
        setShowCaptcha(true);
      }

      const serverError = error.response?.data?.error;
      const errorMessage = serverError || "Ошибка авторизации/регистрации";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Введите email!");
      return;
    }

    setError("");
    try {
      const response = await axios.post("http://localhost:8080/reset-password", { email });
      alert(response.data.message);
      setIsForgotPassword(false);
    } catch (error) {
      setError(error.response?.data?.error || "Ошибка восстановления пароля");
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <AnimatePresence>
        <motion.div
          key={isForgotPassword ? "forgot-password-modal" : isRegister ? "register-modal" : "login-modal"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
          className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center absolute"
        >
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            {isForgotPassword ? "Восстановление пароля" : isRegister ? "Регистрация" : "Вход"}
          </motion.h2>

          {error && (
            <motion.div
              className="text-red-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p>{error}</p>
            </motion.div>
          )}

          {isForgotPassword ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.input
                type="email"
                placeholder="Введите ваш email"
                className="w-full p-3 mb-3 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.button
                className="bg-teal-500 text-white w-full py-3 rounded-lg mb-3"
                onClick={handlePasswordReset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Восстановить пароль
              </motion.button>
              <motion.p
                className="text-blue-500 text-sm cursor-pointer"
                onClick={() => setIsForgotPassword(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                Вернуться к авторизации
              </motion.p>
            </motion.div>
          ) : (
            <>
              <motion.input
                type="text"
                placeholder={isRegister ? "Логин" : "Логин или Email"}
                className="w-full p-3 mb-3 border rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              {isRegister && (
                <motion.input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 mb-3 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}
              <div className="relative mb-3">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  className="w-full p-3 border rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onCopy={(e) => e.preventDefault()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                >
                  <motion.img
                    src={showPassword ? "eye-open.png" : "eye-closed.png"}
                    alt="Toggle password visibility"
                    className="w-6 h-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.2 }}
                  />
                </span>
              </div>
              {isRegister && (
                <div className="relative mb-5">
                  <motion.input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    className="w-full p-3 border rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onCopy={(e) => e.preventDefault()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  >
                    <motion.img
                      src={showConfirmPassword ? "eye-open.png" : "eye-closed.png"}
                      alt="Toggle confirm password visibility"
                      className="w-6 h-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.2 }}
                    />
                  </span>
                </div>
              )}
              {showCaptcha && (
                <motion.div
                  className="mb-3 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {console.log("ReCAPTCHA Site Key:", process.env.REACT_APP_RECAPTCHA_SITE_KEY)}
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                </motion.div>
              )}
              <motion.button
                className="bg-gradient-to-br from-indigo-400 to-indigo-500 text-white w-full py-3 rounded-lg mb-3"
                onClick={handleAuth}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : isRegister ? "Зарегистрироваться" : "Войти"}
              </motion.button>

              <motion.div
                className="flex justify-center gap-5 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.div
                  className="w-11 h-11 flex justify-center items-center bg-red-500 text-white rounded-full cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleSocialAuth("Google")}
                >
                  <FaGoogle style={{ fontSize: "1.4rem" }} />
                </motion.div>
                <motion.div
                  className="w-11 h-11 flex justify-center items-center bg-blue-600 text-white rounded-full cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleSocialAuth("VK")}
                >
                  <SlSocialVkontakte style={{ fontSize: "1.6rem", color: "white" }} />
                </motion.div>
                <motion.div
                  className="w-11 h-11 flex justify-center items-center bg-blue-400 text-white rounded-full cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleSocialAuth("Telegram")}
                >
                  <SiTelegram style={{ fontSize: "1.6rem", color: "white" }} />
                </motion.div>
              </motion.div>

              <motion.p
                className="text-blue-500 text-sm cursor-pointer mt-6"
                onClick={() => setIsRegister(!isRegister)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.2 }}
              >
                {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
              </motion.p>

              <motion.p
                className="text-blue-500 text-sm cursor-pointer mt-2"
                onClick={() => setIsForgotPassword(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.3 }}
              >
                Забыли пароль?
              </motion.p>
            </>
          )}
          <button
            className="mt-4 text-red-500 w-full text-lg"
            onClick={onClose}
          >
            Закрыть
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthModal;