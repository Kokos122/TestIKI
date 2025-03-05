import React, { useState, useEffect } from "react";
import { FaTimes, FaHome, FaUser, FaTasks } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300); // Длительность анимации
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen || isAnimating ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 w-72 h-full flex flex-col shadow-lg rounded-r-3xl transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full shadow-md hover:bg-red-700 transition duration-300"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Навигация */}
        <ul className="w-full flex flex-col space-y-4 mt-16">
          <li>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-5 text-lg text-gray-700 hover:bg-teal-500 hover:text-white rounded-xl transition duration-300"
            >
              <FaHome className="text-2xl" />
              Главная
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-5 text-lg text-gray-700 hover:bg-teal-500 hover:text-white rounded-xl transition duration-300"
            >
              <FaTasks className="text-2xl" />
              Тесты
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 py-3 px-5 text-lg text-gray-700 hover:bg-teal-500 hover:text-white rounded-xl transition duration-300"
            >
              <FaUser className="text-2xl" />
              Мой профиль
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
