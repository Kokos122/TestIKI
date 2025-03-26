import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TestsPage = ({ darkMode }) => {
  const testItems = [
    { 
      img: "/images/test9.png", 
      title: "Кто ты из Ходячих мертвецов?", 
      link: "/walking-dead-test",
      rating: 4,
      category: "🎭 Персонажи",
      completed: 75
    },
    { 
      img: "/images/test1.png", 
      title: "Кто ты из Смешариков?", 
      link: "/smeshariki-test",
      rating: 5,
      category: "🎭 Персонажи",
      completed: 90
    },
    { 
      img: "/images/test2.png", 
      title: "Тест на тревожность", 
      link: "/anxiety-test",
      rating: 3,
      category: "🧠 Психология",
      completed: 60
    },
    { 
      img: "/images/test3.png", 
      title: "Тест на влюбленность", 
      link: "/love-test",
      rating: 4,
      category: "❤️ Отношения",
      completed: 80
    },
    { 
      img: "/images/test4.png", 
      title: "Тест на проф.ориентацию", 
      link: "/career-test",
      rating: 4,
      category: "🧠 Психология",
      completed: 70
    },
    { 
      img: "/images/test5.png", 
      title: "Тест на логику", 
      link: "/logic-test",
      rating: 5,
      category: "🧩 Логика",
      completed: 85
    },
    { 
      img: "/images/test6.png", 
      title: "Тест на креативность", 
      link: "/creativity-test",
      rating: 3,
      category: "🧠 Психология",
      completed: 55
    },
    { 
      img: "/images/test7.png", 
      title: "Тест на знание флагов", 
      link: "/flags-test",
      rating: 4,
      category: "🌍 География",
      completed: 78
    },
    { 
      img: "/images/test8.png", 
      title: "Кто ты из Дюны?", 
      link: "/dune-test",
      rating: 5,
      category: "🎭 Персонажи",
      completed: 92
    },
    { 
      img: "/images/test10.png", 
      title: "Тест на память", 
      link: "/memory-test",
      rating: 3,
      category: "🧠 Психология",
      completed: 65
    },
  ];

  // Анимации
  const pageVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    exit: { opacity: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "backOut"
      }
    }),
    hover: {
      y: -10,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const bgCircleVariants = {
    animate: {
      x: [0, 100, 0],
      y: [0, 50, 0],
      opacity: [0.03, 0.1, 0.03],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={`min-h-screen py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Анимированный фон */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={bgCircleVariants}
          animate="animate"
          className={`absolute rounded-full ${darkMode ? "bg-violet-800/20" : "bg-violet-200/40"}`}
          style={{
            width: "30vw",
            height: "30vw",
            top: "15%",
            left: "10%"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Все тесты
          </h1>
          <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Выберите интересующий вас тест
          </p>
        </motion.div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testItems.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              className="group"
            >
              <Link to={item.link} className="block h-full">
                <div className={`relative h-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } group-hover:shadow-2xl`}>
                  
                  {/* Изображение */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      darkMode ? "from-gray-900/70" : "from-black/50"
                    }`} />
                    
                    {/* Бейдж категории */}
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      darkMode ? "bg-gray-900 text-violet-300" : "bg-white text-violet-600"
                    }`}>
                      {item.category}
                    </span>
                    
                    {/* Иконка в углу */}
                    <div className={`absolute top-0 right-0 w-12 h-12 flex items-center justify-center rounded-bl-2xl ${
                      darkMode ? "bg-violet-700" : "bg-violet-600"
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Контент карточки */}
                  <div className="p-5">
                    <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}>
                      {item.title}
                    </h3>
                    
                    {/* Рейтинг */}
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon 
                            key={star}
                            filled={star <= item.rating}
                            darkMode={darkMode}
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {Math.floor(Math.random() * 100 + 50)} отзывов
                      </span>
                    </div>
                    
                    {/* Прогресс бар */}
                    <div className="mb-4">
                      <div className={`h-2 rounded-full overflow-hidden ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.completed}%` }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className={`h-full rounded-full ${
                            darkMode ? "bg-gradient-to-r from-violet-500 to-purple-500" 
                                     : "bg-gradient-to-r from-violet-400 to-purple-400"
                          }`}
                        />
                      </div>
                    </div>
                    
                    {/* Кнопка */}
                    <button className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                      darkMode ? "bg-violet-600 hover:bg-violet-700 text-white" 
                               : "bg-violet-500 hover:bg-violet-600 text-white"
                    } transition-colors duration-300`}>
                      Пройти тест
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Компонент звезды рейтинга
const StarIcon = ({ filled, darkMode }) => (
  <svg 
    className={`w-5 h-5 ${filled ? "text-yellow-400" : darkMode ? "text-gray-600" : "text-gray-300"}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default TestsPage;