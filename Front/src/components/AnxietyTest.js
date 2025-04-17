import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TestLayout from "./TestLayout.js";

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
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate("/tests");
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
        console.error("Error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load test");
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
      // 1. Проверяем наличие scoring_rules
      if (!test?.scoring_rules) {
        throw new Error("Правила оценки не найдены в данных теста");
      }
  
      // 2. Парсим scoring_rules (если это строка JSON)
      let scoringData = test.scoring_rules;
      if (typeof scoringData === 'string') {
        try {
          scoringData = JSON.parse(scoringData);
        } catch (parseError) {
          throw new Error("Не удалось распарсить правила оценки");
        }
      }
  
      // 3. Проверяем структуру scoringData
      if (!scoringData || typeof scoringData !== 'object') {
        throw new Error("Некорректный формат правил оценки");
      }
  
      // 4. Получаем объект scoring из scoringData
      const scoring = scoringData.scoring;
      if (!scoring) {
        throw new Error("Отсутствует объект scoring в правилах оценки");
      }
  
      // 5. Проверяем ranges
      if (!Array.isArray(scoring.ranges)) {
        throw new Error("Отсутствует или некорректен массив ranges в правилах оценки");
      }
  
      // 6. Рассчитываем сырой балл
      const rawScore = Object.values(answers).reduce((sum, answer) => sum + (answer || 0), 0);
      
      // 7. Рассчитываем максимально возможный балл
      const maxScore = questions.length * 3;
      
      // 8. Масштабируем к диапазону 0-60 (как в ваших scoring.ranges)
      const scaledScore = Math.min(Math.round((rawScore / maxScore) * 60), 60);
      
      // 9. Находим соответствующий диапазон
      const matchedRange = scoring.ranges.find(
        range => scaledScore >= (range.min || 0) && scaledScore <= range.max
      );
  
      setTotalScore(scaledScore);
      setResultData({
        text: matchedRange?.text || `Результат ${scaledScore}% не попадает в заданные диапазоны`,
        description: "",
      });
    } catch (err) {
      console.error("Error calculating score:", err);
      setResultData({
        text: "Ошибка при расчете результата",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
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
        <h2 className="text-2xl font-bold mb-4">{error ? "Error" : "Test not found"}</h2>
        <p className="text-red-500 mb-6">{error || "The requested test was not found"}</p>
        <button
          onClick={() => navigate("/tests")}
          className={`px-4 py-2 rounded ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        >
          Back to Tests
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
        <>
          <h2 className="text-2xl font-bold">Результат:</h2>
          <p className="text-xl mt-2">
            Ваш результат: {totalScore}% - {resultData?.text || "Не определено"}
          </p>
          {resultData?.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">{resultData.description}</p>
          )}
        </>
      }
      onHome={() => navigate("/")}
    >
      <p className="font-semibold flex items-center text-lg">
        {currentQuestionData.text}
      </p>
      <div className="mt-4 space-y-3">
        {currentQuestionData.options.map((option, index) => (
          <label key={index} className="block cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestionData.id}`}
              checked={answers[currentQuestionData.id] === index}
              onChange={() => handleAnswerChange(currentQuestionData.id, index)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </TestLayout>
  );
};

export default AnxietyTest;