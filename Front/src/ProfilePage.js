import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, 
  FaListAlt, 
  FaTrophy, 
  FaUserEdit, 
  FaSignOutAlt,
  FaUpload,
  FaTrash,
  FaInfoCircle,
  FaSort,
  FaCalendarAlt,
  FaClock,
  FaCalendarDay,
  FaHeart,
  FaChartBar,
  FaClipboardList,
  FaBrain,
  FaRegClock
} from 'react-icons/fa';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from 'react-toastify';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ProfilePage = ({ user, darkMode, onAvatarUpdate, onLogout }) => {
  const [testResults, setTestResults] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('stats');
  const [graphTab, setGraphTab] = useState('activity');
  const [timeframe, setTimeframe] = useState('day');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const navigate = useNavigate();
  const [achievementPage, setAchievementPage] = useState(0);
  const [prevPage, setPrevPage] = useState(0);
  const achievementsPerPage = 4;
  const [isGraphReady, setIsGraphReady] = useState(false);
  
  const defaultAvatar = 'https://res.cloudinary.com/dbynlpzwa/image/upload/t_default/v1747240081/default_n0gsmv.png';

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  // Загрузка результатов тестов
  useEffect(() => {
    const fetchTestResults = async () => {
      setIsLoadingResults(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/user/test-results', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTestResults(response.data.test_results);
      } catch (error) {
        console.error('Error fetching test results:', error);
        toast.error(error.response?.data?.error || 'Ошибка при загрузке результатов тестов');
      } finally {
        setIsLoadingResults(false);
      }
    };
    
    if (user) {
      fetchTestResults();
    }
  }, [user]);

  // Задержка для рендеринга графика
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGraphReady(true);
    }, 0); // Задержка 300 мс для синхронизации с Framer Motion
    return () => clearTimeout(timer);
  }, []);

  // Подготовка данных для графиков
  const averageScore = testResults.length > 0 
    ? (testResults.reduce((acc, result) => acc + result.score, 0) / testResults.length)
    : 0;

  // Данные для линейного графика активности
  const activityData = useMemo(() => {
    const data = testResults.reduce((acc, test) => {
      const date = new Date(test.completed_at);
      let key;
      
      if (timeframe === 'day') {
        key = date.toLocaleDateString();
      } else if (timeframe === 'week') {
        const weekNum = Math.ceil(date.getDate() / 7);
        key = `${date.getFullYear()}-${date.getMonth()+1}-W${weekNum}`;
      } else { // month
        key = `${date.getFullYear()}-${date.getMonth()+1}`;
      }
      
      if (!acc[key]) {
        acc[key] = { date: key, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {});

    return Object.values(data).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [testResults, timeframe]);


  // Данные для круговой диаграммы категорий
  const categoryData = useMemo(() => {
    const categories = testResults.reduce((acc, result) => {
      const category = result.category || 'Без категории';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  }, [testResults]);

  const favoriteCategory = useMemo(() => {
  if (!Array.isArray(categoryData) || categoryData.length === 0) return null;
  return categoryData.reduce((max, current) => {
    const maxValue = typeof max.value === 'number' ? max.value : 0;
    const currentValue = typeof current.value === 'number' ? current.value : 0;
    return currentValue > maxValue ? current : max;
  });
}, [categoryData]);

  // Самый активный день
  const mostActiveDay = useMemo(() => {
    const dayStats = testResults.reduce((acc, test) => {
      const date = new Date(test.completed_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, count: 0, totalScore: 0 };
      }
      acc[date].count++;
      acc[date].totalScore += test.score;
      return acc;
    }, {});

    const days = Object.values(dayStats);
    if (days.length === 0) return {};
    
    const mostActive = days.sort((a, b) => b.count - a.count)[0];
    return {
      ...mostActive,
      avgScore: (mostActive.totalScore / mostActive.count).toFixed(1)
    };
  }, [testResults]);

  // Любимый тест
  const favoriteTest = useMemo(() => {
    const testStats = testResults.reduce((acc, test) => {
      if (!acc[test.test_id]) {
        acc[test.test_id] = {
          name: test.test_name,
          count: 0,
          attempts: []
        };
      }
      acc[test.test_id].count++;
      acc[test.test_id].attempts.push({
        score: test.score,
        date: new Date(test.completed_at)
      });
      return acc;
    }, {});

    const tests = Object.values(testStats);
    if (tests.length === 0) return {};
    
    const favorite = tests.sort((a, b) => b.count - a.count)[0];
    favorite.attempts.sort((a, b) => a.date - b.date);
    
    const improvement = favorite.attempts.length > 1
      ? ((favorite.attempts[favorite.attempts.length-1].score - favorite.attempts[0].score) / 
         favorite.attempts[0].score * 100).toFixed(1)
      : 0;

    return {
      ...favorite,
      improvement
    };
  }, [testResults]);

  // Сортировка и фильтрация результатов
  const sortedResults = [...testResults].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.completed_at) - new Date(a.completed_at);
    if (sortBy === 'score') return b.score - a.score;
    return a.test_name.localeCompare(b.test_name);
  });

  const filteredResults = filterCategory === 'all' 
    ? sortedResults 
    : sortedResults.filter(r => r.category === filterCategory);

  // Проверка достижений
  const achievements = [
    { id: 1, name: 'Эксперт', earned: testResults.length >= 25, icon: '🥇', description: 'Пройдите 25 тестов' },
    { id: 2, name: 'Любитель', earned: testResults.length >= 10, icon: '🥈', description: 'Пройдите 5 тестов' },
    { id: 3, name: 'Новичок', earned: testResults.length >= 5, icon: '🥉', description: 'Пройдите 5 тестов' },
    { id: 4, name: 'Старт', earned: testResults.length >= 1, icon: '🚀', description: 'Пройдите первый тест' },
    { id: 5, name: 'Универсал', earned: categoryData.length >= 5, icon: '🧠', description: 'Пройдите тесты в 5+ категориях' },
    { id: 6, name: 'Спринтер', earned: testResults.length >= 3 && testResults.some(r => new Date(r.completed_at).getTime() > Date.now() - 86400000), icon: '⚡', description: 'Пройдите 3 теста за день' },
    { id: 7, name: 'Мастер категории', earned: categoryData.some(c => c.value >= 5), icon: '🎯', description: 'Пройдите 5+ тестов в одной категории' },
    { id: 8, name: 'Профессионал', earned: testResults.length >= 50, icon: '🎖️', description: 'Пройдите 50 тестов' }
  ];


  // Обработчики событий
  const handleLogoutClick = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      onLogout();
    }
  };
  
  const handleDeleteAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:8080/avatar', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onAvatarUpdate(response.data.avatar_url || defaultAvatar);
      toast.success('Аватар сброшен на стандартный');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error(error.response?.data?.error || 'Ошибка при удалении аватара');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Пожалуйста, выберите изображение (JPEG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Файл слишком большой (максимум 5MB)');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/upload-avatar',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      onAvatarUpdate(response.data.avatar_url);
      toast.success('Аватар успешно обновлен!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Ошибка при загрузке аватарки');
      toast.error('Ошибка при загрузке аватарки');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:8080/update-profile', {
        username,
        email
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Профиль успешно обновлен!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900"
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className={`
            text-3xl font-bold
            ${
              darkMode 
                ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" 
                : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
            }
          `}>
            Мой профиль
          </h1>
        </motion.div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - информация о пользователе */}
          <div className="space-y-6">
            {/* Блок с аватаркой */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`p-6 rounded-2xl shadow-xl ${
                darkMode 
                  ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center">
                <div 
                  className="relative w-40 h-40 rounded-full mb-4 group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img 
                    src={user.avatar_url || defaultAvatar} 
                    alt="Аватар" 
                    className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-lg transition-all duration-300 group-hover:border-indigo-400"
                  />
                  
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center gap-3"
                      >
                        <label
                          className={`px-2 py-1 text-sm rounded-full flex items-center cursor-pointer transition ${
                            darkMode 
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          }`}
                        >
                          <FaUpload className="mr-1 text-base" />
                          Изменить
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              handleAvatarChange(e);
                              setIsHovered(false);
                            }}
                            accept="image/*"
                            disabled={isLoading}
                          />
                        </label>

                        {user.avatar_url && !user.avatar_url.includes('default-avatar') && (
                          <button
                            onClick={handleDeleteAvatar}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-full flex items-center hover:bg-red-700 transition">
                            <FaTrash className="mr-2" />
                            Удалить
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className={`w-full rounded-full h-2 mt-4 ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Информация о пользователе */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`p-6 rounded-2xl shadow-xl ${
                darkMode 
                  ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                  : "bg-white border border-gray-200"
              }`}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Имя пользователя
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" 
                          : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                      } border focus:outline-none focus:ring-2`}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" 
                          : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                      } border focus:outline-none focus:ring-2`}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 rounded-lg transition flex items-center justify-center ${
                        darkMode 
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      } disabled:opacity-50`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Сохранение...
                        </>
                      ) : 'Сохранить'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 rounded-lg transition ${
                        darkMode 
                          ? "bg-gray-600 hover:bg-gray-500 text-white" 
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      } disabled:opacity-50`}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>{user.email}</p>
                    <p className={`text-sm mt-2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}>
                      Зарегистрирован: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg transition ${
                        darkMode 
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      <FaUserEdit className="mr-2" />
                      Редактировать профиль
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg transition ${
                        darkMode 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      <FaSignOutAlt className="mr-2" />
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Достижения */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`p-6 rounded-2xl shadow-xl relative ${
                darkMode 
                  ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaTrophy className="mr-2 text-yellow-500" /> Достижения
              </h3>

              {/* Кнопка "Назад" */}
              <button 
                onClick={() => {
                  if (achievementPage > 0) {
                    setPrevPage(achievementPage);
                    setAchievementPage(p => p - 1);
                  }
                }}
                disabled={achievementPage === 0}
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 shadow-md transition-all duration-300 transform hover:scale-110 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-indigo-600 text-white' 
                    : 'bg-gray-200 hover:bg-indigo-100 text-indigo-600'
                } ${achievementPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Предыдущая страница"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Кнопка "Вперед" */}
              <button 
                onClick={() => {
                  const totalPages = Math.ceil(achievements.length / achievementsPerPage) - 1;
                  if (achievementPage < totalPages) {
                    setPrevPage(achievementPage);
                    setAchievementPage(p => p + 1);
                  }
                }}
                disabled={achievementPage >= Math.ceil(achievements.length / achievementsPerPage) - 1}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 shadow-md transition-all duration-300 transform hover:scale-110 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-indigo-600 text-white' 
                    : 'bg-gray-200 hover:bg-indigo-100 text-indigo-600'
                } ${achievementPage >= Math.ceil(achievements.length / achievementsPerPage) - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Следующая страница"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Анимированный контейнер с достижениями */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={achievementPage}
                  initial={{ opacity: 0, x: achievementPage > prevPage ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: achievementPage > prevPage ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {achievements
                    .slice(
                      achievementPage * achievementsPerPage,
                      (achievementPage + 1) * achievementsPerPage
                    )
                    .map((achievement) => (
                      <motion.div 
                        key={achievement.id}
                        whileHover={{ scale: 1.03 }}
                        className={`p-3 rounded-lg text-center transition ${
                          achievement.earned 
                            ? darkMode 
                              ? "bg-yellow-900/20 border border-yellow-800/50" 
                              : "bg-yellow-100 border border-yellow-200"
                            : darkMode 
                              ? "bg-gray-700/30 border border-gray-600/50" 
                              : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="text-2xl mb-1">
                          {achievement.earned ? achievement.icon : '🔒'}
                        </div>
                        <p className="text-sm font-medium">
                          {achievement.name}
                        </p>
                        <p className={`text-xs mt-1 ${
                          achievement.earned 
                            ? darkMode ? "text-yellow-400" : "text-yellow-600"
                            : darkMode ? "text-gray-500" : "text-gray-400"
                        }`}>
                          {achievement.description}
                        </p>
                      </motion.div>
                    ))
                  }
                </motion.div>
              </AnimatePresence>

              {/* Индикаторы страниц */}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: Math.ceil(achievements.length / achievementsPerPage) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrevPage(achievementPage);
                      setAchievementPage(i);
                    }}
                    className={`w-2 h-2 rounded-full ${
                      i === achievementPage 
                        ? darkMode ? 'bg-yellow-400' : 'bg-yellow-500'
                        : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Перейти к странице ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Правая колонка - статистика и результаты */}
          <div className="lg:col-span-2 space-y-6">
            {/* Табы для переключения между статистикой и результатами */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex rounded-lg p-1 ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2 px-4 rounded-md transition flex items-center justify-center ${
                  activeTab === 'stats' 
                    ? darkMode 
                      ? "bg-indigo-600 text-white shadow-lg" 
                      : "bg-white text-indigo-600 shadow-lg"
                    : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FaChartLine className="mr-2" /> Статистика
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 py-2 px-4 rounded-md transition flex items-center justify-center ${
                  activeTab === 'results' 
                    ? darkMode 
                      ? "bg-indigo-600 text-white shadow-lg" 
                      : "bg-white text-indigo-600 shadow-lg"
                    : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FaListAlt className="mr-2" /> Результаты
              </button>
            </motion.div>

            {/* Контент табов */}
            {activeTab === 'stats' ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
              >
                {/* Общая статистика */}
                <motion.div 
                  variants={containerVariants}
                  className={`p-6 rounded-2xl shadow-xl ${
                    darkMode 
                      ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <motion.h3 variants={itemVariants} className="text-xl font-bold mb-4">
                    Общая статистика
                  </motion.h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { 
                        value: testResults.length, 
                        label: 'Пройдено тестов', 
                        color: 'text-purple-600',
                        bgColor: 'bg-purple-50',
                        darkBgColor: 'bg-purple-950/20',
                        icon: <FaBrain className="text-xl mb-1 text-purple-600 dark:text-purple-400" />
                      },
                      { 
                        value: favoriteCategory?.name || 'Нет данных', 
                        label: 'Любимая категория',
                        color: 'text-pink-600',
                        bgColor: 'bg-pink-50',
                        darkBgColor: 'bg-pink-950/20',
                        icon: <FaHeart className="text-xl mb-1 text-pink-600 dark:text-pink-400" />
                      },
                      { 
                        value: mostActiveDay.date || 'Нет данных', 
                        label: 'Самый активный день', 
                        color: 'text-sky-600',
                        bgColor: 'bg-sky-50',
                        darkBgColor: 'bg-sky-950/20',
                        icon: <FaCalendarDay className="text-xl mb-1 text-sky-600 dark:text-sky-400" />
                      },
                      { 
                        value: favoriteTest.name || 'Нет данных', 
                        label: 'Любимый тест', 
                        color: 'text-emerald-600',
                        bgColor: 'bg-emerald-50',
                        darkBgColor: 'bg-emerald-950/20',
                        icon: <FaClipboardList className="text-xl mb-1 text-emerald-600 dark:text-emerald-400" />
                      },
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        whileHover={{
                          y: -5,
                          transition: { duration: 0.2, ease: "easeInOut" }
                        }}
                        className={`p-4 rounded-lg text-center ${
                          darkMode ? stat.darkBgColor : stat.bgColor
                        } border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div className="mb-2">
                          {stat.icon}
                        </div>
                        <p className={`${
                          stat.label === 'Пройдено тестов' ? 'text-3xl' : 'text-xl'
                        } font-bold ${stat.color} transition-colors duration-200`}>
                          {stat.value}
                        </p>
                        <p className={`text-sm mt-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        } transition-colors duration-200`}>
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Графики */}
                <motion.div 
                  variants={containerVariants}
                  className={`p-6 rounded-2xl shadow-xl ${
                    darkMode 
                      ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <motion.h3 variants={itemVariants} className="text-xl font-bold mb-4">
                    Визуализация данных
                  </motion.h3>

                  {/* Вкладки графиков */}
                  <div className="flex mb-4 border-b">
                    <button
                      onClick={() => {
                        setGraphTab('activity');
                        setIsGraphReady(false); // Сбрасываем для повторной анимации
                        setTimeout(() => setIsGraphReady(true), 300);
                      }}
                      className={`px-4 py-2 font-medium ${
                        graphTab === 'activity' 
                          ? darkMode 
                            ? "border-b-2 border-indigo-400 text-indigo-400" 
                            : "border-b-2 border-indigo-600 text-indigo-600"
                          : darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Активность
                    </button>
                    <button
                      onClick={() => {
                        setGraphTab('categories');
                        setIsGraphReady(false); // Сбрасываем для повторной анимации
                        setTimeout(() => setIsGraphReady(true), 300);
                      }}
                      className={`px-4 py-2 font-medium ${
                        graphTab === 'categories' 
                          ? darkMode 
                            ? "border-b-2 border-indigo-400 text-indigo-400" 
                            : "border-b-2 border-indigo-600 text-indigo-600"
                          : darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Категории
                    </button>
                  </div>
                  
                  {/* Анимированный контент графиков */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={graphTab}
                      initial={{ opacity: 0, x: graphTab === 'activity' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: graphTab === 'activity' ? 20 : -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {graphTab === 'activity' ? (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">График активности</h4>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  setTimeframe('day');
                                  setIsGraphReady(false); // Сбрасываем для анимации
                                  setTimeout(() => setIsGraphReady(true), 300);
                                }}
                                className={`px-3 py-1 text-xs rounded ${
                                  timeframe === 'day' 
                                    ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                По дням
                              </button>
                              <button 
                                onClick={() => {
                                  setTimeframe('week');
                                  setIsGraphReady(false); // Сбрасываем для анимации
                                  setTimeout(() => setIsGraphReady(true), 300);
                                }}
                                className={`px-3 py-1 text-xs rounded ${
                                  timeframe === 'week' 
                                    ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                По неделям
                              </button>
                              <button 
                                onClick={() => {
                                  setTimeframe('month');
                                  setIsGraphReady(false); // Сбрасываем для анимации
                                  setTimeout(() => setIsGraphReady(true), 300);
                                }}
                                className={`px-3 py-1 text-xs rounded ${
                                  timeframe === 'month' 
                                    ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                По месяцам
                              </button>
                            </div>
                          </div>
                          
                          <div className="h-[330px] mt-4">
                            {isGraphReady && activityData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activityData}>
                                  <XAxis 
                                    dataKey="date" 
                                    tick={{ fill: darkMode ? '#e2e8f0' : '#475569' }}
                                  />
                                  <YAxis 
                                    tick={{ fill: darkMode ? '#e2e8f0' : '#475569' }}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      background: darkMode ? '#1e293b' : '#ffffff',
                                      borderColor: darkMode ? '#4f46e5' : '#6366f1',
                                      borderRadius: '0.5rem',
                                      color: darkMode ? '#f8fafc' : '#1e293b'
                                    }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke={darkMode ? '#8884d8' : '#6366f1'} 
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    isAnimationActive={true}
                                    animationBegin={0}
                                    animationDuration={1000}
                                    animationEasing="ease-in-out"
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                {activityData.length === 0 ? (
                                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    Нет данных для отображения
                                  </p>
                                ) : (
                                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="font-medium mb-2">Распределение по категориям</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={categoryData.length > 0 ? categoryData : [{ name: 'Нет данных', value: 1 }]}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => 
                                    categoryData.length > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : 'Нет данных'
                                  }
                                  isAnimationActive={true}
                                  animationBegin={0}
                                  animationDuration={1000}
                                  animationEasing="ease-in-out"
                                >
                                  {categoryData.length > 0 ? (
                                    categoryData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))
                                  ) : (
                                    <Cell fill="#ccc" />
                                  )}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    background: darkMode ? '#1e293b' : '#ffffff',
                                    borderColor: darkMode ? '#4f46e5' : '#6366f1',
                                    borderRadius: '0.5rem',
                                    color: darkMode ? '#f8fafc' : '#1e293b'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Анализ категорий</h4>
                            {categoryData.length > 0 ? (
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {favoriteCategory && (
                                  `Вы чаще всего выбираете тесты по категории "${favoriteCategory.name}"`
                                )}
                              </p>
                            ) : (
                              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                Недостаточно данных для анализа категорий
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
                
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Фильтры и сортировка */}
                <div className={`p-6 rounded-2xl shadow-xl ${
                  darkMode 
                    ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                    : "bg-white border border-gray-200"
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">
                      История прохождения тестов
                    </h3>
                    <div className="flex space-x-3">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`px-3 py-2 rounded border text-sm ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                      >
                        <option value="date">По дате</option>
                        <option value="score">По баллам</option>
                        <option value="name">По названию</option>
                      </select>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className={`px-3 py-2 rounded border text-sm ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                      >
                        <option value="all">Все категории</option>
                        {Array.from(new Set(testResults.map(r => r.category || 'Без категории'))).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Список результатов */}
                {isLoadingResults ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="relative">
                    {/* Эффект размытия сверху списка */}
                    <div 
                      className={`absolute top-0 left-0 right-0 h-8 pointer-events-none ${
                        darkMode 
                          ? "bg-gradient-to-b from-gray-800/90 to-transparent" 
                          : "bg-gradient-to-b from-white/90 to-transparent"
                      }`}
                    />

                    {/* Основной контейнер с прокруткой */}
                    <div 
                      className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 pb-6"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarGutter: 'stable',
                      }}
                    >
                      {filteredResults.map((result) => (
                        <div 
                          key={result.id}
                          className={`p-4 rounded-lg border ${
                            darkMode 
                              ? "border-gray-700 bg-gray-750" 
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{result.test_name}</h3>
                              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {new Date(result.completed_at).toLocaleDateString()}
                                {result.category && ` • ${result.category}`}
                              </p>
                              <div className={`h-2 rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-gray-200"
                              } mt-2`}>
                                <div 
                                  className={`h-full rounded-full ${
                                    result.score >= 70 ? 'bg-green-500' : 
                                    result.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${result.score}%` }}
                                />
                              </div>
                            </div>
                            <div className={`text-lg font-bold ${
                              result.score >= 70 ? (darkMode ? "text-green-400" : "text-green-600") :
                              result.score >= 40 ? (darkMode ? "text-yellow-400" : "text-yellow-600") :
                              (darkMode ? "text-red-400" : "text-red-600")
                            }`}>
                              {result.score}%
                            </div>
                          </div>
                          <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {result.result_text}
                          </p>
                          <div className="mt-3 flex justify-between items-center">
                            <button 
                              onClick={() => setSelectedResult(result)}
                              className={`text-sm ${
                                darkMode 
                                  ? "text-blue-400 hover:text-blue-300" 
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
                            >
                              Подробнее
                            </button>
                            <button 
                              onClick={() => navigator.clipboard.writeText(
                                `Я набрал ${result.score}% в тесте "${result.test_name}"`
                              )}
                              className={`text-sm ${
                                darkMode 
                                  ? "text-gray-400 hover:text-gray-300" 
                                  : "text-gray-600 hover:text-gray-800"
                              }`}
                            >
                              Поделиться
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Эффект размытия внизу списка */}
                    <div 
                      className={`absolute bottom-0 left-0 right-0 h-8 pointer-events-none ${
                        darkMode 
                          ? "bg-gradient-to-t from-gray-800/90 to-transparent" 
                          : "bg-gradient-to-t from-white/90 to-transparent"
                      }`}
                    />
                  </div>
                ) : (
                  <div className={`p-8 text-center rounded-2xl shadow-xl ${
                    darkMode 
                      ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                      : "bg-white border border-gray-200"
                  }`}>
                    <h4 className="text-xl font-medium mb-2">
                      {testResults.length === 0 
                        ? 'Вы еще не прошли ни одного теста'
                        : 'Нет результатов по выбранному фильтру'}
                    </h4>
                    <p className={`mb-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {testResults.length === 0
                        ? 'Пройдите тесты, чтобы увидеть здесь свои результаты'
                        : 'Попробуйте изменить параметры фильтрации'}
                    </p>
                    <button 
                      onClick={() => navigate('/tests')}
                      className={`px-6 py-2 rounded-lg transition ${
                        darkMode 
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      Перейти к тестам
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div> {/* Закрываем основной <div> из строки 331 */}

        {/* Модальное окно с деталями теста */}
        {selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-2xl p-6 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-xl font-bold mb-2">{selectedResult.test_name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Дата прохождения:</p>
                  <p>{new Date(selectedResult.completed_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Результат:</p>
                  <p>{selectedResult.score}%</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Ответы:</h4>
                <pre className={`p-3 rounded text-sm overflow-auto max-h-60 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {JSON.stringify(selectedResult.answers, null, 2)}
                </pre>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className={`px-4 py-2 rounded ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;