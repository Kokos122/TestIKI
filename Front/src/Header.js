import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';

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
  const controls = useAnimation();


    // Определяем варианты анимации
  const slideUp = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Анимация фона с безопасным удалением
  useEffect(() => {
    let isMounted = true;
    
    const animateGradient = async () => {
      while (isMounted) {
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
    
    return () => {
      isMounted = false; // Защита от утечек памяти
    };
  }, [controls, darkMode]);

  // Компонент энергетических волн
  const EnergyWaves = () => (
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

  // Оптимизированные плавающие частицы
  const FloatingParticles = () => (
  <>
    {[...Array(30)].map((_, i) => (
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
          x: [0, (Math.random() - 0.5) * 20, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 5 + Math.random() * 10,
          repeat: Infinity,
          delay: Math.random() * 2, // Уменьшенная задержка
          ease: 'easeInOut'
        }}
      />
    ))}
  </>
);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative flex justify-between items-center px-4 sm:px-6 py-4 h-18 sticky top-0 z-50 overflow-hidden ${
        darkMode ? 'text-indigo-300' : 'text-white'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label="Основной заголовок"
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

      {/* Визуальные эффекты */}
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

      {/* Левая часть - лого и меню */}
      <div className="flex items-center space-x-4 sm:space-x-5 z-10">
        <motion.button
          onClick={onSidebarToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all"
          aria-label="Открыть меню"
        >
          <FaBars size={20} />
        </motion.button>

        <Link to="/" className="flex items-center z-10" aria-label="На главную">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <img 
              src="/images/logo-white.png" 
              alt="TESTiki"
              className="h-8 sm:h-10 w-auto"
            />
          </motion.div>
        </Link>
      </div>

      {/* Правая часть - кнопки */}
      <div className="flex items-center space-x-3 sm:space-x-4 z-10 relative">
        {/* Кнопка смены темы */}
        <motion.button
          onClick={onThemeToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full backdrop-blur-md ${
            darkMode ? 'bg-gray-800/40' : 'bg-white/20'
          } transition-all`}
          aria-label={`Переключить на ${darkMode ? 'светлую' : 'тёмную'} тему`}
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

        {/* Кнопка профиля или входа */}
        {isAuthenticated ? (
          <motion.button
            onClick={onProfileClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full hover:bg-white/10 transition-all relative"
            aria-label="Профиль пользователя"
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
        ) : (
          <motion.button
            onClick={onProfileClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 sm:px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm"
            aria-label="Войти в систему"
          >
            Войти
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};

// Проверка типов пропсов
Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  onProfileClick: PropTypes.func.isRequired,
  onSidebarToggle: PropTypes.func.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired
};

export default Header;