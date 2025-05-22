import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TestLayout from "./TestLayout.js";
import { toast } from "react-toastify";

const BeckHopelessnessTest = ({ darkMode }) => {
  const location = useLocation();
  const slug = location.pathname.split("/")[1]; // e.g., "beck-hopelessness-test"
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
        console.log("Fetched test data:", response.data.test); // Debug
        // Validate questions
        if (response.data.test.questions.length !== 20) {
          console.warn(`Expected 20 questions, received ${response.data.test.questions.length}`);
          toast.warn(`Ожидалось 20 вопросов, получено ${response.data.test.questions.length}`);
        }
        response.data.test.questions.forEach((q) => {
          if (!q.options || q.options.length !== 2 || (q.options[0] !== "0" && q.options[0] !== "Нет") || (q.options[1] !== "1" && q.options[1] !== "Да")) {
            console.warn(`Некорректные опции для вопроса ${q.id}:`, q.options);
            toast.warn(`Некорректные опции для вопроса ${q.id}: ${JSON.stringify(q.options)}`);
          }
        });
        setTest(response.data.test);
        setTestDescription(response.data.test.description || "");
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
    const question = questions.find((q) => q.id === questionId);
    console.log(
      "handleAnswerChange - Question ID:",
      questionId,
      "Value:",
      value,
      "Type:",
      typeof value,
      "Question:",
      question?.text,
      "Options:",
      question?.options
    ); // Enhanced debug
    let numericValue;
    if (value === "Yes" || value === "Да" || value === "1" || value === 1) {
      numericValue = 1;
    } else if (value === "No" || value === "Нет" || value === "0" || value === 0) {
      numericValue = 0;
    } else {
      console.error("Invalid value received:", value, "for question ID:", questionId, "Question:", question?.text);
      toast.error(`Недопустимое значение ответа: ${value} для вопроса ${questionId} (${question?.text}). Выберите 'Да' или 'Нет'`);
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: numericValue,
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
      Object.entries(answers).forEach(([questionId, answer]) => {
        if (answer !== 0 && answer !== 1) {
          throw new Error(`Недопустимое значение ответа для вопроса ${questionId}: ${answer}`);
        }
        total += answer;
      });

      if (total > 20) {
        throw new Error("Суммарный балл не может превышать 20");
      }

      const finalScore = total;

      const matchedRange = scoringData.scoring.ranges.find(
        (range) => finalScore >= (range.min || 0) && finalScore <= range.max
      ) || {};

      setTotalScore(finalScore);
      setResultData({
        text: matchedRange.text || `Результат: ${finalScore}`,
        description: matchedRange.description || "",
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
        test_name: test.title,
        score: score || 0,
        result_text: resultText || "Результат не определен",
        answers: answers,
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
      title={test.title}
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

export default BeckHopelessnessTest;