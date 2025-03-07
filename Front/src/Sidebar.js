import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Sidebar = ({ onClose, isOpen }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-teal-500 w-64 h-full p-6 flex flex-col justify-between"
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
        <div className="text-white cursor-pointer" onClick={onClose}>
          <FaTimes size={30} />
        </div>

        {/* Основное содержимое бокового меню */}
        <div className="text-white flex-grow mt-10">
          <ul className="space-y-4">
            <li>
              <Link to="/" onClick={onClose} className="cursor-pointer">
                Главная
              </Link>
            </li>
            <li className="cursor-pointer">Тесты</li>
            <li className="cursor-pointer">Истории</li>
            <li className="cursor-pointer">Популярное</li>
            <li className="cursor-pointer">Мой профиль</li>
            <li className="cursor-pointer">Настройки</li>
            <li>
              <Link to="/about" onClick={onClose} className="cursor-pointer">
                О нас
              </Link>
            </li>
          </ul>
        </div>

        {/* Информация ниже */}
        <div className="text-white mt-10 text-sm">
          <p>© 2025 Все права защищены</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
