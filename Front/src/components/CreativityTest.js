import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TestLayout from "./TestLayout.js";
import { toast } from "react-toastify";

const CreativityTest = ({ darkMode }) => {
  const location = useLocation();
  const slug = location.pathname.split("/")[2] || "creativity-test";
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
    description: "",
  });
  const [testDescription, setTestDescription] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:8080",
  });

  useEffect(() => {
    if (!slug) {
      navigate("/tests");
      return;
    }
    const fetchTest = async () => {
      try {
        const response = await api.get(`/tests/${slug}`);
        if (!response.data.test) {
          throw new Error("Test data is empty");
        }
        setTest(response.data.test);
        setTestDescription(response.data.test.description || "Узнайте, насколько вы креативны!");
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Не удалось загрузить тест");
        toast.error("Не удалось загрузить тест");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [slug, navigate]);

  const questions = test?.questions || [];

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 400);
  };

  const calculateScore = () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.warning("Пожалуйста, ответьте на все вопросы");
      return;
    }
    setIsSubmitting(true);
    try {
      if (!test?.scoring_rules) {
        throw new Error("Правила оценки не найдены");
      }
      let scoringData = test.scoring_rules;
      if (typeof scoringData === "string") {
        scoringData = JSON.parse(scoringData);
      }
      if (!scoringData?.scoring?.ranges) {
        throw new Error("Некорректные правила оценки");
      }
      let total = 0;
      Object.values(answers).forEach((answer) => {
        total += answer;
      });
      const finalScore = total;
      const matchedRange = scoringData.scoring.ranges.find(
        (range) => finalScore >= (range.min || 0) && finalScore <= range.max
      ) || {};
      setTotalScore(finalScore);
      setResultData({
        text: matchedRange.text || `Результат: ${finalScore} баллов`,
        description: matchedRange.description || "Ваши ответы указывают на вашу креативность!",
      });
      return saveTestResult(finalScore, matchedRange.text);
    } catch (err) {
      console.error("Ошибка расчета:", err);
      setResultData({
        text: "Ошибка расчета",
        description: err.message,
      });
      toast.error("Ошибка при расчете результата");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveTestResult = async (score, resultText) => {
    try {
      const payload = {
        test_slug: slug,
        test_name: test.title || "Тест на креативность",
        score: score || 0,
        result_text: resultText || "Результат не определен",
        answers: answers,
        category: "Креативность",
        completed_at: new Date().toISOString(),
      };
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      await api.post("/test-result", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Результат сохранен!");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      toast.error(error.response?.data?.error || "Ошибка сохранения");
      throw error;
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-500"
          }`}
        ></div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen p-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">
          {error ? "Ошибка" : "Тест не найден"}
        </h2>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {error || "Запрошенный тест не существует"}
        </p>
        <button
          onClick={() => navigate("/tests")}
          className={`px-6 py-3 rounded-lg ${
            darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
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
      title={test.title || "Тест на креативность"}
      description={testDescription}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      onPrev={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
      onNext={() => {
        if (answers[currentQuestionData.id] !== undefined) {
          setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1));
        } else {
          toast.warning("Пожалуйста, выберите ответ");
        }
      }}
      onSubmit={calculateScore}
      isSubmitting={isSubmitting}
      canSubmit={Object.keys(answers).length === questions.length}
      showResults={totalScore !== null}
      results={
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-blue-50"
            }`}
          >
            <p className="text-xl font-semibold mb-2">{resultData.text}</p>
            {resultData.description && (
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {resultData.description}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setAnswers({});
              setCurrentQuestion(0);
              setTotalScore(null);
              setResultData({ text: "", description: "" });
            }}
            className={`px-4 py-2 rounded-lg mt-4 ${
              darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white`}
          >
            Пройти снова
          </button>
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

export default CreativityTest;