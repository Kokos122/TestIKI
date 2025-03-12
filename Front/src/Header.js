import React from "react";
import { FaUserCircle, FaBars, FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ onProfileClick, onSidebarToggle, onThemeToggle, darkMode }) => {
  const headerBg = darkMode
    ? "bg-gradient-to-br from-slate-600 to-slate-950 text-white"
    : "bg-gradient-to-br from-indigo-300 to-indigo-500 text-black";

  return (
    <header className={`flex justify-between items-center p-4 rounded-b-2xl transition-colors duration-300 ${headerBg} h-20`}>
      
      {/* Боковое меню */}
      <button onClick={onSidebarToggle} className="cursor-pointer">
        <FaBars size={35} />
      </button>

      {/* Логотип (СДВИНУТ ВЛЕВО) */}
      <Link to="/" className="flex items-center ml-7">
        <img
          src={darkMode ? "/images/logo-white.png" : "/images/logo-black.png"}
          alt="TestIKI Logo"
          className="h-14 w-auto"
        />
      </Link>

      {/* Контейнер для кнопок справа */}
      <div className="ml-auto flex items-center space-x-6">
        {/* Переключение темы */}
        <button onClick={onThemeToggle} aria-label="Переключить тему">
          {darkMode ? <FaMoon size={24} /> : <FaSun size={30} />}
        </button>

        {/* Иконка профиля */}
        <button onClick={onProfileClick} className="cursor-pointer">
          <FaUserCircle size={48} />
        </button>
      </div>
      
    </header>
  );
};

export default Header;
