import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFlag } from "react-icons/fa";
import { Link } from "react-router-dom";

const flagQuestions = [
  {
    image: "https://flagcdn.com/w320/fr.png", // Франция
    options: ["Италия", "Франция", "Нидерланды", "Россия"],
    correct: 1
  },
  {
    image: "https://flagcdn.com/w320/jp.png", // Япония
    options: ["Китай", "Южная Корея", "Япония", "Таиланд"],
    correct: 2
  },
  {
    image: "https://flagcdn.com/w320/cn.png", // Китай
    options: ["Аргентина", "Португалия", "Китай", "Мексика"],
    correct: 2
  },
  {
    image: "https://flagcdn.com/w320/ch.png", // Швйецария
    options: ["США", "Австрия", "Канада", "Швейцария"],
    correct: 3
  },
  {
    image: "https://flagcdn.com/w320/tr.png", // Турция
    options: ["Турция", "Индия", "Бангладеш", "Лаос"],
    correct: 0
  },
  {
    image: "https://flagcdn.com/w320/kz.png", // Казахстан
    options: ["Казахстан", "Германия", "Сингапур", "Франция"],
    correct: 0
  },
  {
    image: "https://flagcdn.com/w320/de.png", // Германия
    options: ["Судан", "США", "Нигер", "Германия"],
    correct: 3
  },
  {
    image: "https://flagcdn.com/w320/no.png", // Норвегия
    options: ["Аргентина", "Беларусь", "Норвегия", "Швеция"],
    correct: 2
  },
  {
    image: "https://flagcdn.com/w320/it.png", // Канада
    options: ["Перу", "УкраинаZ", "Италия", "Чили"],
    correct: 2
  },
  {
    image: "https://flagcdn.com/w320/nz.png", // Индия
    options: ["Австралия", "Новая Зеландия", "Самоа", "Фиджи"],
    correct: 1
  },
];

const FlagsTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(flagQuestions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = index;
    setUserAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentQuestion < flagQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateScore(updatedAnswers);
      }
    }, 300);
  };

  const calculateScore = (answers) => {
    let correctCount = 0;
    answers.forEach((ans, i) => {
      if (ans === flagQuestions[i].correct) correctCount++;
    });
    setScore(correctCount);
    setShowResult(true);
  };

  const getResultText = () => {
    if (score <= 3) return "Ты флаговый нубик 😅 Надо подтянуть географию!";
    if (score <= 8) return "Хорош, но можно лучше! 🌍";
    return "Ты флаговый мастер! 🏆 Красавчик!";
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-4xl font-extrabold text-center mb-10">Угадай страну по <span className="text-blue-500">флагу</span>!</h1>

      {!showResult && (
        <>
          <div className="relative mb-6">
            <div className="h-2 rounded-full bg-gray-300 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / flagQuestions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Вопрос {currentQuestion + 1} из {flagQuestions.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`p-6 md:p-8 rounded-2xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <div className="flex justify-center mb-6">
                <img
                  src={flagQuestions[currentQuestion].image}
                  alt="Флаг"
                  className="w-48 h-32 object-cover border rounded-xl shadow-lg"
                />
              </div>
              <p className="font-semibold text-xl flex items-center justify-center mb-4">
                <FaFlag className="text-blue-500 mr-2" /> Чей это флаг?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {flagQuestions[currentQuestion].options.map((option, i) => {
                  const isSelected = userAnswers[currentQuestion] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`p-5 rounded-2xl text-left font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-600 shadow-md scale-105"
                          : darkMode
                          ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                          : "bg-white border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {showResult && (
        <div className={`mt-10 p-6 rounded-2xl shadow-2xl text-center ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <h2 className="text-3xl font-extrabold mb-4 text-green-500">Результат</h2>
          <p className="text-xl mb-4">{getResultText()}</p>
          <p className="text-lg">Ты ответил правильно на {score} из {flagQuestions.length} вопросов.</p>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link to="/">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FlagsTest;