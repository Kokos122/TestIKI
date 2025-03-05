import React from "react";
import { FaTimes } from "react-icons/fa"; // Иконка для закрытия меню
import { motion } from "framer-motion"; // Импортируем framer-motion

const Sidebar = ({ onClose, isOpen }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50"
      initial={{ opacity: 0 }} // Начальная прозрачность
      animate={{ opacity: isOpen ? 1 : 0 }} // Плавно изменяем прозрачность
      exit={{ opacity: 0 }} // Прозрачность при закрытии
      transition={{ duration: 0.3 }} // Длительность анимации
    >
      {/* Боковое меню */}
      <motion.div
        className="bg-teal-500 w-64 h-full p-6 flex flex-col justify-between"
        initial={{ x: "-100%" }} // Меню сдвинуто влево
        animate={{ x: isOpen ? 0 : "-100%" }} // Сдвиг в зависимости от состояния
        exit={{ x: "-100%" }} // Меню сдвигается влево при закрытии
        transition={{
          type: "spring", // Плавность анимации
          stiffness: 300, // Жесткость
          damping: 30 // Демпинг
        }}
      >
        {/* Кнопка закрытия меню */}
        <div className="text-white cursor-pointer" onClick={onClose}>
          <FaTimes size={30} />
        </div>

        {/* Основное содержимое бокового меню */}
        <div className="text-white flex-grow mt-10">
          <ul className="space-y-4">
            <li className="cursor-pointer">Главная</li>
            <li className="cursor-pointer">Тесты</li>
            <li className="cursor-pointer">Истории</li>
            <li className="cursor-pointer">Популярное</li>
            <li className="cursor-pointer">Мой профиль</li>
            <li className="cursor-pointer">Настройки</li>
            <li className="cursor-pointer">О нас</li>
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
