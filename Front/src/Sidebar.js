import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Sidebar = ({ onClose, isOpen, darkMode }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-64 h-full rounded-e-2xl p-6 flex flex-col justify-between transition-colors duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-slate-900 to-slate-700 text-white"
            : "bg-gradient-to-br from-indigo-500 to-indigo-300 text-black"
        }`}
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Кнопка закрытия меню */}
        <div className="cursor-pointer" onClick={onClose}>
          <FaTimes size={30} />
        </div>

        {/* Основное содержимое бокового меню */}
        <div className="flex-grow mt-10">
          <ul className="space-y-4">
            <li>
              <Link to="/" onClick={onClose} className="hover:text-gray-400 transition">
                Главная
              </Link>
            </li>
            <li className="hover:text-gray-400 transition">Тесты</li>
            <li className="hover:text-gray-400 transition">Истории</li>
            <li className="hover:text-gray-400 transition">Популярное</li>
            <li>
              <Link to="/profile" onClick={onClose} className="hover:text-gray-400 transition">
                Мой профиль
              </Link>
            </li>

            <li className="hover:text-gray-400 transition">Настройки</li>
            <li>
              <Link to="/about" onClick={onClose} className="hover:text-gray-400 transition">
                О нас
              </Link>
            </li>
          </ul>
        </div>

        {/* Информация ниже */}
        <div className="mt-10 text-sm">
          <p>© 2025 Все права защищены</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
