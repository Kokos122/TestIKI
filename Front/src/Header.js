import React from "react";
import { FaUserCircle } from "react-icons/fa"; // Иконка профиля
import { FaBars } from "react-icons/fa"; // Иконка гамбургер-меню

const Header = ({ onProfileClick, onSidebarToggle }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-teal-500 text-white">
      {/* Кнопка для открытия бокового меню (гамбургер-меню) */}
      <div className="cursor-pointer" onClick={onSidebarToggle}>
        <FaBars size={30} />
      </div>

      {/* Иконка профиля */}
      <div className="cursor-pointer" onClick={onProfileClick}>
        <FaUserCircle size={30} />
      </div>
    </header>
  );
};

export default Header;
