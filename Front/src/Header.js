import React from "react";
import { FaUserCircle, FaBars, FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = ({ onProfileClick, onSidebarToggle, onThemeToggle, darkMode }) => {
  const headerBg = darkMode
    ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 shadow-gray-900/50"
    : "bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 shadow-indigo-400/50";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.3
      }}
      className={`flex justify-between items-center px-6 py-3 h-20 shadow-2xl ${headerBg} sticky top-0 z-50`}
    >
      {/* Левая часть */}
      <div className="flex items-center space-x-6">
        {/* Кнопка меню */}
        <motion.button
          onClick={onSidebarToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <FaBars size={24} className={darkMode ? "text-indigo-300" : "text-indigo-100"} />
        </motion.button>

        {/* Логотип */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/">
            <img
              src={darkMode ? "/images/logo-white.png" : "/images/logo-black.png"}
              alt="TestIKI Logo"
              className="h-12 w-auto transition-transform"
            />
          </Link>
        </motion.div>
      </div>

      {/* Правая часть */}
      <div className="flex items-center space-x-6">
        {/* Переключатель темы */}
        <motion.button
          onClick={onThemeToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`p-2 rounded-full ${darkMode ? "bg-indigo-900/30" : "bg-white/30"}`}
          aria-label="Переключить тему"
        >
          {darkMode ? (
            <FaMoon size={20} className="text-indigo-300" />
          ) : (
            <FaSun size={22} className="text-yellow-400" />
          )}
        </motion.button>

        {/* Иконка профиля */}
        <motion.button
          onClick={onProfileClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={`p-1 rounded-full ${darkMode ? "" : "bg-white/20 backdrop-blur-sm"}`}
        >
          <FaUserCircle 
            size={40} 
            className={darkMode ? "text-indigo-300" : "text-indigo-700 drop-shadow-lg"} 
          />
        </motion.button>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              x: [0, 100 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, 50, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            className={`absolute rounded-full ${darkMode ? "bg-indigo-500/15" : "bg-white/30"}`}
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              top: `${10 + i * 10}%`,
              left: `${i * 15}%`,
              filter: "blur(20px)"
            }}
          />
        ))}

        {/* Дополнительный градиентный блик */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        />
      </div>
    </motion.header>
  );
};

export default Header;