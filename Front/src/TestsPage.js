import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaClock, 
  FaQuestionCircle, 
  FaChartBar,
  FaLock,
  FaUserLock
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const TestsPage = ({ darkMode, isAuthenticated }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // Загрузка тестов
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tests');
        setTests(response.data.tests || []);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError('Не удалось загрузить тесты');
        toast.error('Не удалось загрузить тесты');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Фильтрация тестов
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Получаем уникальные категории
  const categories = ['all', ...new Set(tests.map(test => test.category))];

  // Обработчик клика по тесту
  const handleTestClick = (testId) => {
    if (!isAuthenticated) {
      toast.info('Для прохождения тестов необходимо войти в систему');
      return;
    }
    navigate(`/test/${testId}`);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-md`}>
          <h2 className="text-2xl font-bold mb-4">Ошибка загрузки</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Заголовок и поиск */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Доступные тесты
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className={`relative flex-grow ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <input
                type="text"
                placeholder="Поиск тестов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 rounded-lg border-0 focus:ring-2 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400 focus:ring-indigo-500' : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-400'}`}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border-0 focus:ring-2 ${darkMode ? 'bg-gray-800 text-white focus:ring-indigo-500' : 'bg-white text-gray-900 focus:ring-indigo-400'}`}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Все категории' : category}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Список тестов */}
        {filteredTests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-8 text-center rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className="text-xl font-medium mb-2">Тесты не найдены</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm.trim() ? 'Попробуйте изменить параметры поиска' : 'Нет доступных тестов'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTests.map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleTestClick(test.id)}
                  className={`p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'} ${!isAuthenticated ? 'opacity-80' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{test.title}</h2>
                    {!isAuthenticated && (
                      <FaLock className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    )}
                  </div>
                  
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {test.description || 'Описание отсутствует'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-800'}`}>
                      {test.category || 'Без категории'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center ${darkMode ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                      <FaQuestionCircle className="mr-1" /> {test.questions?.length || 0}
                    </span>
                    {test.time_limit > 0 && (
                      <span className={`px-3 py-1 rounded-full text-xs flex items-center ${darkMode ? 'bg-emerald-900/50 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>
                        <FaClock className="mr-1" /> {test.time_limit} мин
                      </span>
                    )}
                  </div>
                  
                  {!isAuthenticated && (
                    <div className={`mt-4 p-2 rounded-lg text-sm flex items-center ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-yellow-700'}`}>
                      <FaUserLock className="mr-2" /> Войдите для прохождения
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsPage;