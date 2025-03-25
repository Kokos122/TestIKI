import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TestsPage = ({ darkMode }) => {
  const testItems = [
    { 
      img: "/images/test9.png", 
      title: "Кто ты из Ходячих мертвецов?", 
      link: "/walking-dead-test",
      rating: 4,
      category: "🎭 Персонажи"
    },
    // ... остальные тесты
  ];

  const categories = [
    { name: "🧠 Психология", count: 4 },
    // ... остальные категории
  ];

  // Анимационные параметры
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className={`min-h-screen py-8 ${darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950" : "bg-gradient-to-br from-neutral-50 to-neutral-100"}`}
    >
      <div className="container mx-auto px-4">
        {/* Категории тестов */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <h3 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Все тесты
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                  darkMode 
                    ? "bg-violet-700 hover:bg-violet-600 text-white" 
                    : "bg-violet-100 hover:bg-violet-200 text-violet-800"
                }`}
              >
                {cat.name}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  darkMode 
                    ? "bg-violet-800 text-violet-300" 
                    : "bg-white text-violet-600"
                }`}>
                  {cat.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Сетка тестов */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
        >
          {testItems.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className={`absolute -inset-1 rounded-xl ${
                darkMode 
                  ? "bg-gradient-to-r from-violet-500/30 to-purple-500/30" 
                  : "bg-gradient-to-r from-violet-100 to-purple-100"
              } opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300`}></div>
              
              <Link 
                to={item.link} 
                className={`relative block h-full rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
                  darkMode ? "bg-violet-800" : "bg-white"
                }`}
              >
                {/* ... остальное содержимое карточки теста ... */}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestsPage;