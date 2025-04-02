import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

const Header = ({ 
  isAuthenticated, 
  currentUser, 
  onProfileClick, 
  onSidebarToggle, 
  onThemeToggle, 
  onLogout,
  darkMode 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние для выпадающего меню
  const dropdownRef = useRef(null); // Референс для выпадающего меню
  const controls = useAnimation();

  // Обработчик клика вне выпадающего меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Анимация фонового градиента
  useEffect(() => {
    const animateGradient = async () => {
      while (true) {
        await controls.start({
          backgroundPosition: [
            '0% 50%',
            '100% 50%',
            '0% 50%'
          ],
          transition: {
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }
        });
      }
    };
    animateGradient();
  }, [controls, darkMode]);

  // Эффект мягких энергетических волн
  const EnergyWaves = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute rounded-full"
            style={{
              width: '150%',
              height: '150%',
              left: '-25%',
              top: '-25%',
              border: `1px solid ${darkMode ? 'rgba(165,180,252,0.2)' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '50%'
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: 1.5,
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>
    );
  };

  // Эффект плавающих частиц
  const FloatingParticles = () => {
    return (
      <>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: darkMode ? 'rgba(165,180,252,0.6)' : 'rgba(255,255,255,0.6)'
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
          />
        ))}
      </>
    );
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative flex justify-between items-center px-6 py-4 h-18 sticky top-0 z-50 overflow-hidden ${
        darkMode ? 'text-indigo-300' : 'text-white'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Анимированный фон */}
      <motion.div
        className="absolute inset-0"
        animate={controls}
        style={{
          background: darkMode
            ? 'linear-gradient(45deg, #111827, #1f2937, #111827)'
            : 'linear-gradient(45deg, #4f46e5, #6366f1, #4f46e5)',
          backgroundSize: '200% 200%'
        }}
      />

      {/* Эффекты */}
      {isHovering && <EnergyWaves />}
      <FloatingParticles />

      {/* Пульсирующая граница */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-0.5"
        animate={{
          opacity: [0.6, 1, 0.6],
          background: darkMode
            ? 'linear-gradient(90deg, transparent, #a5b4fc, transparent)'
            : 'linear-gradient(90deg, transparent, #ffffff, transparent)',
          boxShadow: darkMode
            ? '0 0 10px 2px rgba(165,180,252,0.3)'
            : '0 0 10px 2px rgba(255,255,255,0.3)'
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Левая часть с логотипом */}
      <div className="flex items-center space-x-5 z-10">
        <motion.button
          onClick={onSidebarToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all"
        >
          <FaBars size={20} />
        </motion.button>

        <Link to="/" className="flex items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <img 
              src={darkMode ? "/images/logo-white.png" : "/images/logo-white.png"} 
              alt="TESTiki"
              className="h-10 w-auto"
            />
          </motion.div>
        </Link>
      </div>

      {/* Правая часть с иконками */}
      <div className="flex items-center space-x-4 z-10 relative">
        <motion.button
          onClick={onThemeToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full backdrop-blur-md ${
            darkMode ? 'bg-gray-800/40' : 'bg-white/20'
          } transition-all`}
        >
          {darkMode ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <FaMoon size={18} />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <FaSun size={18} />
            </motion.div>
          )}
        </motion.button>

        {isAuthenticated ? (
          <>
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Переключение состояния меню
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 rounded-full hover:bg-white/10 transition-all relative"
            >
              <FaUserCircle size={28} />
              <motion.div
                className="absolute inset-0 rounded-full border pointer-events-none"
                animate={{
                  borderColor: [
                    `${darkMode ? 'rgba(165,180,252,0)' : 'rgba(255,255,255,0)'}`,
                    `${darkMode ? 'rgba(165,180,252,0.6)' : 'rgba(255,255,255,0.6)'}`,
                    `${darkMode ? 'rgba(165,180,252,0)' : 'rgba(255,255,255,0)'}`
                  ],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.button>

            {/* Выпадающее меню */}
            {isDropdownOpen && (
              <motion.div
                ref={dropdownRef} // Привязываем референс
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-2">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onProfileClick}
                  >
                    <FaUserCircle className="mr-2" /> Мой профиль
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onLogout}
                  >
                    <FaSignOutAlt className="mr-2" /> Выйти
                  </button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.button
            onClick={onProfileClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm"
          >
            Войти
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};

export default Header;