import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TestLayout from "./TestLayout.js";
import { toast } from "react-toastify";

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
  const [resultData, setResultData] = useState({
    text: "",
    description: ""
  }); // Инициализация по умолчанию

  const api = axios.create({
    baseURL: "http://localhost:8080",
  });

  useEffect(() => {
    if (!id) {
      navigate("/tests");
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await api.get(`/tests/${id}`);
        if (!response.data.test) {
          throw new Error("Test data is empty");
        }
        setTest(response.data.test);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load test");
        toast.error("Не удалось загрузить тест");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, navigate]);

  const questions = test?.questions || [];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateScore = () => {
    setIsSubmitting(true);
    
    try {
      if (!test?.scoring_rules) {
        throw new Error("Правила оценки не найдены");
      }

      let scoringData = test.scoring_rules;
      if (typeof scoringData === 'string') {
        scoringData = JSON.parse(scoringData);
      }

      if (!scoringData?.scoring?.ranges) {
        throw new Error("Некорректные правила оценки");
      }

      const rawScore = Object.values(answers).reduce((sum, answer) => sum + (answer || 0), 0);
      const finalScore = Math.max(0, rawScore); // Гарантируем неотрицательный результат

      const matchedRange = scoringData.scoring.ranges.find(
        range => finalScore >= (range.min || 0) && finalScore <= range.max
      ) || {}; // Защита от undefined

      const resultText = matchedRange.text || `Результат: ${finalScore} баллов`;
      const description = matchedRange.description || "";

      setTotalScore(finalScore);
      setResultData({
        text: resultText,
        description: description
      });

      return saveTestResult(finalScore, resultText);
    } catch (err) {
      console.error("Ошибка расчета:", err);
      setResultData({
        text: "Ошибка расчета",
        description: err.message
      });
      toast.error("Ошибка при расчете результата");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveTestResult = async (score, resultText) => {
    try {
      if (!test) {
        throw new Error("Данные теста не загружены");
      }

      const payload = {
        test_id: test.id,
        test_name: test.title || "Без названия",
        score: Math.max(1, score || 1), // Минимум 1 балл
        result_text: resultText || "Результат не определен",
        answers: answers || {}
      };

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Требуется авторизация");
      }

      const response = await api.post('/test-result', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("Результат сохранен!");
      return response.data;
    } catch (error) {
      console.error("Ошибка сохранения:", {
        error: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.error || "Ошибка сохранения");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className={`flex flex-col justify-center items-center h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <h2 className="text-2xl font-bold mb-4">{error ? "Ошибка" : "Тест не найден"}</h2>
        <p className="text-red-500 mb-6">{error || "Запрошенный тест не существует"}</p>
        <button
          onClick={() => navigate("/tests")}
          className={`px-4 py-2 rounded ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        >
          Вернуться к тестам
        </button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <TestLayout
      darkMode={darkMode}
      title={test.title}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      onPrev={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
      onNext={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
      onSubmit={calculateScore}
      isSubmitting={isSubmitting}
      canSubmit={Object.keys(answers).length === questions.length}
      showResults={totalScore !== null}
      results={
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Результат:</h2>
          <p className="text-xl">{resultData.text}</p>
          {resultData.description && (
            <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {resultData.description}
            </p>
          )}
        </div>
      }
      onHome={() => navigate("/")}
      currentQuestionData={currentQuestionData}
      answers={answers}
      handleAnswerChange={handleAnswerChange}
      isLoading={loading}
      error={error}
    />
  );
};

export default AnxietyTest; 