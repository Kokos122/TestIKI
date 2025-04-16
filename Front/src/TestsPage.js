import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const TestsPage = ({ darkMode }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTests, setFilteredTests] = useState([]);
  const navigate = useNavigate();

  // Загрузка тестов с сервера
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tests');
        if (!response.data.tests) {
          throw new Error('No tests data received');
        }
        setTests(response.data.tests);
        setFilteredTests(response.data.tests);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError(err.message || 'Failed to load tests');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Фильтрация тестов по поисковому запросу
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTests(tests);
    } else {
      const filtered = tests.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTests(filtered);
    }
  }, [searchTerm, tests]);

  // Обработчик ошибок
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen p-4 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}>
        <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Tests</h2>
        <p className="mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`px-6 py-2 rounded-lg ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Отображение загрузки
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Tests</h1>
        
        {/* Поисковая строка */}
        <div className={`relative mb-8 max-w-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-md`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className={`${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-3 pl-10 pr-4 rounded-lg focus:outline-none ${
              darkMode 
                ? 'bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500'
                : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400'
            }`}
          />
        </div>

        {/* Список тестов */}
        {filteredTests.length === 0 ? (
          <div className={`p-8 text-center rounded-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className="text-xl font-medium mb-2">No tests found</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm.trim() ? 'Try a different search term' : 'No tests available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                onClick={() => navigate(`/test/${test.id}`)}
                className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <h2 className="text-xl font-bold mb-3">{test.title}</h2>
                <p className={`mb-4 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {test.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? 'bg-indigo-900 text-indigo-200'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {test.category || 'Uncategorized'}
                  </span>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {test.questions ? test.questions.length : 0} questions
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsPage;