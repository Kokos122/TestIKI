import React from "react";
import { FaUserCircle, FaBars, FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ onProfileClick, onSidebarToggle, onThemeToggle, darkMode }) => {
  const headerBg = darkMode
    ? "bg-gradient-to-br from-slate-700 to-slate-950 text-white"
    : "bg-gradient-to-br from-teal-200 to-teal-500 text-black";

  return (
    <header className={`flex justify-between items-center p-4 transition-colors duration-300 ${headerBg} h-16`}>
      
      {/* Боковое меню */}
      <button onClick={onSidebarToggle} className="cursor-pointer">
        <FaBars size={35} />
      </button>

      {/* Логотип */}
      <Link to="/" className="flex items-center mx-auto">
        <img
          src={darkMode ? "/images/logo-white.png" : "/images/logo-black.png"}
          alt="TestIKI Logo"
          className="h-11 w-auto"
        />
      </Link>

      {/* Переключение темы */}
      <button onClick={onThemeToggle} aria-label="Переключить тему">
        {darkMode ? <FaMoon size={24} /> : <FaSun size={24} />}
      </button>

      {/* Иконка профиля */}
      <button onClick={onProfileClick} className="cursor-pointer ml-4">
        <FaUserCircle size={40} />
      </button>

    </header>
  );
};

export default Header;
