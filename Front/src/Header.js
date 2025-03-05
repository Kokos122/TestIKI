import React from "react";
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ onProfileClick, onMenuToggle }) => {
  return (
    <header className="flex justify-between items-center bg-teal-600 px-6 py-4 text-white text-xl h-20">
      <button onClick={onMenuToggle} className="text-2xl">Меню</button>
      <button onClick={onProfileClick} className="text-4xl">
        <FaUserCircle />
      </button>
    </header>
  );
};

export default Header;
