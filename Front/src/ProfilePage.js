import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaChartLine, 
  FaListAlt, 
  FaTrophy, 
  FaUserEdit, 
  FaSignOutAlt,
  FaUpload,
  FaTrash,
  FaCopy,
  FaInfoCircle,
  FaSort
} from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProfilePage = ({ user, darkMode, onAvatarUpdate, onLogout, toggleTheme }) => {
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
    const [isHovered, setIsHovered] = useState(false);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const navigate = useNavigate();
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    // Варианты анимации
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

    const barVariants = {
        hidden: { height: 0 },
        visible: (custom) => ({
            height: custom,
            transition: {
                duration: 0.8,
                ease: 'backOut',
                delay: 0.3,
            },
        }),
    };

    // Загрузка результатов тестов
    useEffect(() => {
        const fetchTestResults = async () => {
            setIsLoadingResults(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/user/test-results', {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setTestResults(response.data.test_results || []);
            } catch (error) {
                console.error('Error fetching test results:', error);
                setError('Не удалось загрузить результаты тестов');
                toast.error('Не удалось загрузить результаты тестов');
            } finally {
                setIsLoadingResults(false);
            }
        };
        
        if (user) {
            fetchTestResults();
        }
    }, [user]);

    // Подготовка данных для графиков
    const averageScore = testResults.length > 0 
        ? (testResults.reduce((acc, result) => acc + result.score, 0) / testResults.length )
        : 0;

    const scoreDistribution = [
        { name: 'Высокий (80-100%)', value: testResults.filter(r => r.score >= 80).length },
        { name: 'Средний (50-79%)', value: testResults.filter(r => r.score >= 50 && r.score < 80).length },
        { name: 'Низкий (<50%)', value: testResults.filter(r => r.score < 50).length },
    ];

    const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

    const testCategories = testResults.reduce((acc, result) => {
        const category = result.category || 'Без категории';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.entries(testCategories).map(([name, value]) => ({
        name,
        value
    }));

    // Сортировка и фильтрация результатов
    const sortedResults = [...testResults].sort((a, b) => {
        if (sortBy === 'date') return new Date(b.completed_at) - new Date(a.completed_at);
        if (sortBy === 'score') return b.score - a.score;
        return a.test_name.localeCompare(b.test_name);
    });

    const filteredResults = filterCategory === 'all' 
        ? sortedResults 
        : sortedResults.filter(r => r.category === filterCategory);

    // Просмотр деталей теста
    const viewTestDetails = (result) => {
        setSelectedResult(result);
    };

    // Выход из аккаунта
    const handleLogoutClick = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            onLogout();
        }
    };
    
    const handleDeleteAvatar = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete('http://localhost:8080/avatar', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            onAvatarUpdate(response.data.avatar_url);
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

    // Проверка достижений
    const achievements = [
        { id: 1, name: 'Новичок', earned: testResults.length >= 1, icon: '🥉', description: 'Пройдите первый тест' },
        { id: 2, name: 'Любитель', earned: testResults.length >= 5, icon: '🥈', description: 'Пройдите 5 тестов' },
        { id: 3, name: 'Эксперт', earned: testResults.length >= 10, icon: '🥇', description: 'Пройдите 10 тестов' },
        { id: 4, name: 'Отличник', earned: averageScore >= 80, icon: '🏅', description: 'Средний балл 80%+' },
    ];

    // Рекомендации тестов
    const recommendations = [
        { id: 1, name: 'Тест на логику', category: 'Логика', icon: FaChartLine },
        { id: 2, name: 'Тест по психологии', category: 'Психология', icon: FaChartLine },
    ];

    // Компонент ProgressBar
    const ProgressBar = ({ score }) => (
        <div className={`h-2 rounded-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
        } mt-2`}>
            <div 
                className={`h-full rounded-full ${
                    score >= 70 ? 'bg-green-500' : 
                    score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
            />
        </div>
    );

    // Компонент TestResultCard
    const TestResultCard = ({ result, darkMode, onViewDetails }) => (
        <div className={`p-4 rounded-lg border ${
            darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium">{result.test_name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(result.completed_at).toLocaleDateString()}
                        {result.category && ` • ${result.category}`}
                    </p>
                    <ProgressBar score={result.score} />
                </div>
                <div className={`text-lg font-bold ${
                    result.score >= 70 ? (darkMode ? 'text-green-400' : 'text-green-600') :
                    result.score >= 40 ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') :
                    (darkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                    {result.score}%
                </div>
            </div>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.result_text}
            </p>
            <div className="mt-3 flex justify-between items-center">
                <button 
                    onClick={() => onViewDetails(result)}
                    className={`text-sm ${
                        darkMode ? 'text-blue-400 hover:text-blue-300' : 
                        'text-blue-600 hover:text-blue-800'
                    }`}
                >
                    Подробнее
                </button>
                <button 
                    onClick={() => navigator.clipboard.writeText(
                        `Я набрал ${result.score}% в тесте "${result.test_name}"`
                    )}
                    className={`text-sm ${
                        darkMode ? 'text-gray-400 hover:text-gray-300' : 
                        'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Поделиться
                </button>
            </div>
        </div>
    );

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode 
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" 
              : "bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900"
          }`}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                                        src={user.avatar_url || '/images/default-avatar.png'} 
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
                            className={`p-6 rounded-2xl shadow-xl ${
                                darkMode 
                                    ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                                    : "bg-white border border-gray-200"
                            }`}
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <FaTrophy className="mr-2 text-yellow-500" /> Достижения
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {achievements.map((achievement) => (
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
                                ref={ref}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
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
                                            { value: testResults.length, label: 'Пройдено тестов', color: 'from-indigo-500 to-purple-600' },
                                            { value: averageScore.toFixed(1), label: 'Средний балл', color: 'from-green-500 to-teal-600' },
                                            { value: testResults.length ? Math.max(...testResults.map(r => r.score)) : 0, label: 'Лучший результат', color: 'from-blue-500 to-indigo-600' },
                                            { value: testResults.length ? Math.min(...testResults.map(r => r.score)) : 0, label: 'Худший результат', color: 'from-red-500 to-pink-600' },
                                        ].map((stat, index) => (
                                            <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 60 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ 
                                                duration: 0.6,
                                                delay: index * 0.2,
                                                ease: "easeOut"
                                            }}
                                            whileHover={{
                                                y: -5,
                                                transition: {
                                                duration: 0.2,  // Увеличенное время анимации при наведении
                                                ease: "easeInOut"
                                                }
                                            }}
                                            className={`p-4 rounded-lg text-center ${
                                                darkMode ? "bg-gray-700/50" : "bg-gray-100"
                                            }`}
                                            >
                                            <p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                                                {stat.value}{stat.label === 'Средний балл' ? '%' : ''}
                                            </p>
                                            <p className="text-sm">{stat.label}</p>
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
                                        Распределение результатов
                                    </motion.h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Круговой график */}
                                        <motion.div 
                                            variants={itemVariants}
                                            className="h-64"
                                        >
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <defs>
                                                        <linearGradient id="pieGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={darkMode ? "#8884d8" : "#6366f1"} stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor={darkMode ? "#8884d8" : "#6366f1"} stopOpacity={0.2}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <Pie
                                                        data={scoreDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="url(#pieGradient)"
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        animationBegin={0}
                                                        animationDuration={1500}
                                                        animationEasing="ease-out"
                                                    >
                                                        {scoreDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                        ))}
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
                                        </motion.div>

                                        {/* Столбчатый график */}
                                        <motion.div 
                                            variants={itemVariants}
                                            className="h-64"
                                        >
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={categoryData}
                                                    layout="vertical"
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <defs>
                                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={darkMode ? "#8884d8" : "#6366f1"} stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor={darkMode ? "#8884d8" : "#6366f1"} stopOpacity={0.2}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis 
                                                        type="number" 
                                                        tick={{ fill: darkMode ? '#e2e8f0' : '#475569' }}
                                                    />
                                                    <YAxis 
                                                        dataKey="name" 
                                                        type="category" 
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
                                                    <Bar 
                                                        dataKey="value" 
                                                        fill="url(#barGradient)" 
                                                        radius={[4, 4, 0, 0]}
                                                        animationDuration={1500}
                                                    >
                                                        {categoryData.map((entry, index) => (
                                                            <motion.cell
                                                                key={`cell-${index}`}
                                                                custom={entry.value * 10}
                                                                variants={barVariants}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Рекомендации */}
                                {testResults.length > 0 && (
                                    <motion.div 
                                        variants={itemVariants}
                                        className={`p-6 rounded-2xl shadow-xl ${
                                            darkMode 
                                                ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
                                                : "bg-white border border-gray-200"
                                        }`}
                                    >
                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <FaChartLine className={`mr-2 ${
                                                darkMode ? "text-indigo-400" : "text-indigo-600"
                                            }`} />
                                            Рекомендуем попробовать
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {recommendations.map((test, index) => (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`p-4 rounded-lg border transition ${
                                                        darkMode 
                                                            ? "border-gray-700 bg-gray-700/30 hover:bg-gray-700/50" 
                                                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                                    } cursor-pointer`}
                                                    onClick={() => navigate(`/test/${test.id}`)}
                                                >
                                                    <div className="flex items-start">
                                                        <div className={`p-2 rounded-md mr-3 ${
                                                            darkMode ? "bg-indigo-900/50" : "bg-indigo-100"
                                                        }`}>
                                                            <test.icon className={darkMode ? "text-indigo-400" : "text-indigo-600"} size={18}/>
                                                        </div>
                                                        <div>
                                                            <h4 className={`font-medium ${
                                                                darkMode ? "text-gray-100" : "text-gray-900"
                                                            }`}>{test.name}</h4>
                                                            <p className={`text-sm ${
                                                                darkMode ? "text-gray-400" : "text-gray-500"
                                                            }`}>{test.category}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
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
                                                <option value="psychology">Психология</option>
                                                <option value="logic">Логика</option>
                                                {/* Добавьте другие категории */}
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
                                    <div className="space-y-4">
                                        {filteredResults.map((result) => (
                                            <TestResultCard 
                                                key={result.id}
                                                result={result}
                                                darkMode={darkMode}
                                                onViewDetails={viewTestDetails}
                                            />
                                        ))}
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
                </div>
            </div>

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
    );
};

export default ProfilePage;