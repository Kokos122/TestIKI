import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { SlSocialVkontakte } from "react-icons/sl";
import Header from "./Header.js";
import Sidebar from "./Sidebar.js";
import TestFeed from "./TestFeed.js";
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

  const handleAuth = async () => {
    const url = isRegister ? "http://localhost:8080/register" : "http://localhost:8080/login";
    const data = { username, password, ...(isRegister && { email }) };
    try {
      const response = await axios.post(url, data);
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">{isRegister ? "Регистрация" : "Вход"}</h2>
        <input
          type="text"
          placeholder={isRegister ? "Логин" : "Логин или Email"}
          className="w-full p-3 mb-3 border rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {isRegister && (
          <div className="relative mb-5">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Повторите пароль"
              className="w-full p-3 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
        <button className="bg-teal-500 text-white w-full py-3 rounded-lg mb-3" onClick={handleAuth}>
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </button>
        <div className="flex justify-center gap-6 mb-4">
          <FaGoogle className="text-red-500 text-3xl cursor-pointer" />
          <SlSocialVkontakte className="text-blue-600 text-4xl cursor-pointer" />
        </div>
        <p className="text-blue-500 text-sm cursor-pointer" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </p>
        {!isRegister && (
          <p
            className="text-blue-500 text-sm cursor-pointer mt-2"
            onClick={() => setForgotPasswordOpen(true)}
          >
            Забыли пароль?
          </p>
        )}
        <button className="mt-4 text-red-500 w-full text-lg" onClick={onClose}>Закрыть</button>
      </motion.div>
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl w-80 text-center">
              <h3 className="text-2xl font-bold mb-4">Восстановление пароля</h3>
              <input
                type="email"
                placeholder="Введите ваш email"
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <button className="bg-teal-500 text-white w-full py-3 rounded-lg mb-3">
                Отправить ссылку
              </button>
              <button
                className="text-red-500 w-full text-lg"
                onClick={() => setForgotPasswordOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
