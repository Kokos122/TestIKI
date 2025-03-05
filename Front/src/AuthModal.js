import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { SlSocialVkontakte } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";

const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleAuth = () => {
    const url = isRegister ? "http://localhost:8080/register" : "http://localhost:8080/login";
    const data = { username, password, ...(isRegister && { email }) };
    alert("Auth handled");
    // axios.post(url, data)
    //   .then(response => alert(response.data.message))
    //   .catch(error => console.error("Error:", error.response ? error.response.data : error));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <AnimatePresence>
        <motion.div
          key={isRegister ? "register-modal" : "login-modal"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
          }}
          className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center absolute"
        >
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            {isRegister ? "Регистрация" : "Вход"}
          </motion.h2>

          {/* Плавно появляются поля формы */}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.div>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </motion.div>
              </span>
            </div>
          )}

          <motion.button
            className="bg-teal-500 text-white w-full py-3 rounded-lg mb-3"
            onClick={handleAuth}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </motion.button>

          <div className="flex justify-center gap-6 mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <FaGoogle className="text-red-500 text-3xl cursor-pointer" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <SlSocialVkontakte className="text-blue-600 text-4xl cursor-pointer" />
            </motion.div>
          </div>

          <motion.p
            className="text-blue-500 text-sm cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9 }}
          >
            {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
          </motion.p>

          {!isRegister && (
            <motion.p
              className="text-blue-500 text-sm cursor-pointer mt-2"
              onClick={() => setForgotPasswordOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
            >
              Забыли пароль?
            </motion.p>
          )}

          <button
            className="mt-4 text-red-500 w-full text-lg"
            onClick={onClose}
          >
            Закрыть
          </button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isForgotPasswordOpen && (
          <motion.div
            key="forgot-password-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.1,
            }}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl w-80 text-center">
              <motion.h3
                className="text-2xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Восстановление пароля
              </motion.h3>

              <motion.input
                type="email"
                placeholder="Введите ваш email"
                className="w-full p-3 mb-4 border rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />

              <motion.button
                className="bg-teal-500 text-white w-full py-3 rounded-lg mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Отправить ссылку
              </motion.button>

              <motion.button
                className="text-red-500 w-full text-lg"
                onClick={() => setForgotPasswordOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Закрыть
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthModal;
