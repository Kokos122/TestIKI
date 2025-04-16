import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaQuestionCircle } from "react-icons/fa";

const AnxietyTest = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка теста из API
  useEffect(() => {
    if (!id) {
      setError("Test ID is missing");
      setLoading(false);
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tests/${id}`);
        if (!response.data.test) {
          throw new Error("Test data is empty");
        }
        setTest(response.data.test);
      } catch (err) {
        console.error("Error fetching test:", err);
        setError(err.response?.data?.error || "Failed to load test");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  // Обработка выбора ответа
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Подсчет результатов
  const calculateScore = async () => {
    if (!test) return;

    // Проверка, что на все вопросы ответили
    const questions = JSON.parse(test.questions);
    if (Object.keys(answers).length < questions.length) {
      setError("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Здесь должна быть ваша логика подсчета баллов
      // Для примера - простой подсчет
      let score = 0;
      questions.forEach((q, index) => {
        if (answers[q.id] !== undefined) score += answers[q.id] + 1;
      });
      score = Math.round((score / (questions.length * 4)) * 100);

      // Отправка результатов на сервер
      const response = await axios.post(
        "http://localhost:8080/test-result",
        {
          test_id: test.id,
          test_name: test.title,
          score: score,
          result_text: getResultText(score),
          answers: answers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTotalScore(score);
    } catch (err) {
      console.error("Error saving results:", err);
      setError("Failed to save test results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultText = (score) => {
    if (score <= 30) return "Низкий уровень тревожности";
    if (score <= 70) return "Средний уровень тревожности";
    return "Высокий уровень тревожности";
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen p-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={() => navigate("/tests")}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          Back to Tests
        </button>
      </div>
    );
  }

  if (!test) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Test not found</h2>
        <button
          onClick={() => navigate("/tests")}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          Back to Tests
        </button>
      </div>
    );
  }

  const questions = JSON.parse(test.questions);

  return (
    <div
      className={`container mx-auto p-4 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-6">{test.title}</h1>

      {totalScore !== null ? (
        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold">Результат:</h2>
          <p className="text-xl mt-2">
            Ваш результат: {totalScore}% - {getResultText(totalScore)}
          </p>
          <div className="mt-6">
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white mr-4`}
            >
              Посмотреть в профиле
            </Link>
            <Link
              to="/tests"
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              К списку тестов
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="relative pt-1 mb-4">
            <div
              className={`overflow-hidden h-4 mb-2 text-xs flex rounded ${
                darkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <div
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  darkMode ? "bg-blue-500" : "bg-blue-600"
                }`}
              ></div>
            </div>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Вопрос {currentQuestion + 1} из {questions.length}
            </p>
          </div>

          <div
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <p className="font-semibold flex items-center text-lg">
              <FaQuestionCircle
                className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />{" "}
              {questions[currentQuestion].text}
            </p>
            {questions[currentQuestion].options.map((option, index) => (
              <label key={index} className="block mt-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${questions[currentQuestion].id}`}
                  checked={
                    answers[questions[currentQuestion].id] === index
                  }
                  onChange={() =>
                    handleAnswerChange(questions[currentQuestion].id, index)
                  }
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500 disabled:opacity-50"
                  : "bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
              }`}
            >
              Назад
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))
                }
                className={`px-4 py-2 rounded ${
                  darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                Далее
              </button>
            ) : (
              <button
                onClick={calculateScore}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-500 disabled:opacity-50"
                    : "bg-green-600 hover:bg-green-700 disabled:opacity-50"
                } text-white`}
              >
                {isSubmitting ? "Отправка..." : "Завершить тест"}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnxietyTest;