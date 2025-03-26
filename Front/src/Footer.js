import React from "react";
import { FaUserCircle, FaBars, FaSun, FaMoon, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ onProfileClick, onSidebarToggle, onThemeToggle, darkMode }) => {
  const headerBg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-500";

  // Анимация выдвижения
  const slideDown = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.5
      }
    },
    exit: { y: -100, opacity: 0 }
  };

  // Анимация иконок
  const iconBounce = {
    hover: {
      y: [0, -5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.header
        variants={slideDown}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`flex justify-between items-center px-6 py-4 h-24 shadow-2xl ${headerBg} sticky top-0 z-50`}
      >
        {/* Левая часть с лого и меню */}
        <div className="flex items-center space-x-8">
          {/* Анимированная кнопка меню */}
          <motion.button
            onClick={onSidebarToggle}
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            className="relative p-3 rounded-full group"
          >
            <FaBars size={24} className={darkMode ? "text-indigo-300" : "text-white"} />
            {/* Эффект пульсации */}
            <motion.span
              className="absolute inset-0 border-2 border-transparent rounded-full pointer-events-none"
              animate={{
                borderColor: [null, darkMode ? "rgba(165,180,252,0.5)" : "rgba(255,255,255,0.5)", "transparent"],
                scale: [1, 1.3, 1],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          </motion.button>

          {/* Логотип с эффектом поднятия */}
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/" className="flex items-center">
              <img
                src={darkMode ? "/images/logo-white.png" : "/images/logo-white.png"}
                alt="Logo"
                className="h-14 w-auto"
              />
              <motion.span 
                className={`ml-3 text-xl font-bold ${darkMode ? "text-indigo-200" : "text-white"}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                TestIKI
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Правая часть с элементами управления */}
        <div className="flex items-center space-x-8">
          {/* Переключатель темы с эффектом орбиты */}
          <motion.div className="relative">
            <motion.button
              onClick={onThemeToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-full ${darkMode ? "bg-indigo-900/30" : "bg-white/30"} backdrop-blur-sm`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaMoon size={20} className="text-indigo-300" />
              ) : (
                <FaSun size={22} className="text-yellow-300" />
              )}
            </motion.button>
            {/* Орбитальные точки */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={`absolute rounded-full ${darkMode ? "bg-indigo-400" : "bg-yellow-300"}`}
                style={{
                  width: 6,
                  height: 6,
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [0, Math.sin(i * 120 * Math.PI/180) * 25, 0],
                  y: [0, Math.cos(i * 120 * Math.PI/180) * 25, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Иконка профиля с выпадающим эффектом */}
          <motion.div className="relative">
            <motion.button
              onClick={onProfileClick}
              variants={iconBounce}
              whileHover="hover"
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full ${darkMode ? "bg-indigo-900/30" : "bg-white/30"} backdrop-blur-sm`}
            >
              <FaUserCircle 
                size={36} 
                className={darkMode ? "text-indigo-300" : "text-white"} 
              />
              <motion.span
                className="absolute -bottom-1 -right-1"
                animate={{
                  rotate: [0, 20, -20, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <FaChevronDown 
                  size={14} 
                  className={darkMode ? "text-indigo-400" : "text-white"} 
                />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Парящие частицы */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${darkMode ? "bg-indigo-400/30" : "bg-white/40"}`}
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, (Math.random() - 0.5) * 30, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}

          {/* Световые блики */}
          {!darkMode && (
            <>
              <motion.div
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/30 via-white/0 to-white/0"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  delay: 5,
                  ease: "linear"
                }}
              />
            </>
          )}
        </div>
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;