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
      if (!test?.scoring_rules) {
        throw new Error("Правила оценки не найдены в данных теста");
      }
  
      let scoringData = test.scoring_rules;
      if (typeof scoringData === 'string') {
        try {
          scoringData = JSON.parse(scoringData);
        } catch (parseError) {
          throw new Error("Не удалось распарсить правила оценки");
        }
      }
  
      if (!scoringData || typeof scoringData !== 'object') {
        throw new Error("Некорректный формат правил оценки");
      }
  
      const scoring = scoringData.scoring;
      if (!scoring) {
        throw new Error("Отсутствует объект scoring в правилах оценки");
      }
  
      if (!Array.isArray(scoring.ranges)) {
        throw new Error("Отсутствует или некорректен массив ranges в правилах оценки");
      }
  
      const rawScore = Object.values(answers).reduce((sum, answer) => sum + (answer || 0), 0);
      
      // Убрано масштабирование к процентам
      const finalScore = rawScore;
      
      const matchedRange = scoring.ranges.find(
        range => finalScore >= (range.min || 0) && finalScore <= range.max
      );
  
      setTotalScore(finalScore);
      setResultData({
        text: matchedRange?.text || `Результат ${finalScore} не попадает в заданные диапазоны`,
        description: matchedRange?.description || "",
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
            {resultData?.text || "Не определено"}
          </p>
          {resultData?.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">{resultData.description}</p>
          )}
        </>
      }
      onHome={() => navigate("/")}
      currentQuestionData={currentQuestionData} // Передаем как пропс
      answers={answers}
      handleAnswerChange={handleAnswerChange}
      isLoading={loading}
      error={error}
    />
  );
};

export default AnxietyTest;