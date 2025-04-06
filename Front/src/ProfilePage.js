import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = ({ user, darkMode, onAvatarUpdate, onLogout }) => {
    const [testResults, setTestResults] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Загрузка результатов тестов
    useEffect(() => {
        const fetchTestResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/me', {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setTestResults(response.data.user.test_results || []);
            } catch (error) {
                console.error('Error fetching test results:', error);
                setError('Не удалось загрузить результаты тестов');
            }
        };
        
        if (user) {
            fetchTestResults();
        }
    }, [user]);

    // Обновление аватарки
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Проверка типа файла
        if (!file.type.match('image.*')) {
            setError('Пожалуйста, выберите изображение (JPEG, PNG)');
            return;
        }

        // Проверка размера файла (макс 5MB)
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
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setError('Ошибка при загрузке аватарки');
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    // Удаление аватарки
    const handleDeleteAvatar = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete('http://localhost:8080/avatar', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Обновляем состояние
            onAvatarUpdate(response.data.avatar_url);
            
            // Показываем уведомление об успехе
            toast.success(response.data.message || 'Аватар успешно удалён', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error deleting avatar:', error);
            
            // Показываем уведомление об ошибке
            toast.error(error.response?.data?.error || 'Ошибка при удалении аватара', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    // Сохранение изменений профиля
    const handleSaveProfile = async () => {
        if (!username || !email) {
            setError('Все поля обязательны для заполнения');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                'http://localhost:8080/profile',
                { username, email },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Ошибка при обновлении профиля');
        } finally {
            setIsLoading(false);
        }
    };

    // Выход из аккаунта
    const handleLogoutClick = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            onLogout();
        }
    };

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className={`min-h-screen flex flex-col items-center px-4 py-6 transition-colors duration-300 ${
            darkMode ? "bg-gradient-to-br from-violet-900 to-violet-950 text-white" 
                    : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"
        }`}>
            <div className="w-full max-w-2xl space-y-6">
                {/* Заголовок */}
                <h1 className="text-3xl font-bold text-center">Мой профиль</h1>
                
                {/* Блок с аватаркой */}
                <div className={`p-6 rounded-xl shadow-lg ${
                    darkMode ? "bg-violet-800 bg-opacity-50 backdrop-blur-sm" : "bg-white"
                }`}>
                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg mb-4">
                            <img 
                                src={user.avatar_url || '/images/default-avatar.png'} 
                                alt="Аватар" 
                                className="w-full h-full object-cover"
                            />
                            {isLoading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex space-x-4">
                            <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50"
                                disabled={isLoading}>
                                Изменить
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleAvatarChange}
                                    accept="image/jpeg,image/png"
                                    disabled={isLoading}
                                />
                            </label>
                            
                            {user.avatar_url && user.avatar_url !== '/images/default-avatar.png' && (
                                <button
                                    onClick={handleDeleteAvatar}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Удалить
                                </button>
                            )}
                        </div>

                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                <div 
                                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Сообщения об ошибках */}
                {error && (
                    <div className={`p-3 rounded-lg text-center ${
                        darkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"
                    }`}>
                        {error}
                    </div>
                )}

                {/* Информация о пользователе */}
                <div className={`p-6 rounded-xl shadow-lg ${
                    darkMode ? "bg-violet-800 bg-opacity-50 backdrop-blur-sm" : "bg-white"
                }`}>
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${
                                    darkMode ? "text-violet-200" : "text-gray-700"
                                }`}>
                                    Имя пользователя
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg ${
                                        darkMode 
                                            ? "bg-violet-900 border-violet-700 text-white" 
                                            : "bg-white border-gray-300 text-gray-800"
                                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${
                                    darkMode ? "text-violet-200" : "text-gray-700"
                                }`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg ${
                                        darkMode 
                                            ? "bg-violet-900 border-violet-700 text-white" 
                                            : "bg-white border-gray-300 text-gray-800"
                                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">{user.username}</h2>
                                <p className={darkMode ? "text-violet-200" : "text-gray-600"}>{user.email}</p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Редактировать профиль
                                </button>
                                <button
                                    onClick={handleLogoutClick}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Выйти
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Результаты тестов */}
                {testResults.length > 0 && (
                    <div className={`p-6 rounded-xl shadow-lg ${
                        darkMode ? "bg-violet-800 bg-opacity-50 backdrop-blur-sm" : "bg-white"
                    }`}>
                        <h3 className="text-xl font-bold mb-4">Мои результаты тестов</h3>
                        <div className="space-y-3">
                            {testResults.map((result, index) => (
                                <div key={index} className={`p-4 rounded-lg ${
                                    darkMode ? "bg-violet-900 bg-opacity-50" : "bg-gray-50"
                                }`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium">{result.testName}</h4>
                                            <p className={`text-sm ${
                                                darkMode ? "text-violet-200" : "text-gray-600"
                                            }`}>
                                                {result.resultText}
                                            </p>
                                            <p className={`text-xs ${
                                                darkMode ? "text-violet-300" : "text-gray-500"
                                            }`}>
                                                {new Date(result.completedAt).toLocaleDateString('ru-RU', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                            result.score >= 80 ? 'bg-green-500' :
                                            result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                            {result.score}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;