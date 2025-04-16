import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const SmesharikiTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(8).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      text: "Какой ваш любимый способ провести выходной?",
      options: [
        "Читать научные статьи или экспериментировать.",
        "Устроить вечеринку или спортивные соревнования.",
        "Рисовать, писать стихи или заниматься музыкой.",
        "Готовить вкусный обед для друзей.",
        "Смотреть документальные фильмы о природе.",
        "Ремонтировать что-то или собирать механизмы.",
        "Рассказывать истории или петь песни.",
        "Копаться в огороде или ухаживать за растениями."
      ]
    },
    {
      text: "Как вы реагируете на неожиданные проблемы?",
      options: [
        "Анализирую ситуацию и ищу научное решение.",
        "Действую быстро, даже если это рискованно.",
        "Ищу творческий подход, чтобы решить проблему красиво.",
        "Стараюсь всех успокоить и поддержать.",
        "Думаю, как природа бы справилась с этим.",
        "Создаю устройство, которое решит проблему.",
        "Рассказываю шутку, чтобы разрядить обстановку.",
        "Беру лопату и начинаю копать, чтобы все исправить."
      ]
    },
    {
      text: "Что для вас самое важное в жизни?",
      options: [
        "Знания и открытия.",
        "Приключения и адреналин.",
        "Творчество и самовыражение.",
        "Дружба и забота о близких.",
        "Гармония с природой.",
        "Технический прогресс и изобретения.",
        "Веселье и хорошее настроение.",
        "Труд и упорство."
      ]
    },
    {
      text: "Как вы относитесь к спорту?",
      options: [
        "Спорт — это не мое, я предпочитаю умственные нагрузки.",
        "Спорт — это моя жизнь, я всегда в движении!",
        "Спорт — это красиво, если это танцы или гимнастика.",
        "Спорт — это хорошо, но только если это не опасно.",
        "Спорт — это часть природы, как бег или плавание.",
        "Спорт — это полезно, но я предпочитаю работать руками.",
        "Спорт — это весело, особенно если это командная игра.",
        "Спорт — это тяжелый труд, как работа в поле."
      ]
    },
    {
      text: "Как вы относитесь к искусству?",
      options: [
        "Искусство — это интересно, но наука важнее.",
        "Искусство — это круто, если оно динамичное!",
        "Искусство — это моя жизнь, я живу им.",
        "Искусство — это способ выразить свои чувства.",
        "Искусство — это часть природы, как пение птиц.",
        "Искусство — это красиво, но я предпочитаю технику.",
        "Искусство — это веселье, особенно музыка и танцы.",
        "Искусство — это хорошо, но труд важнее."
      ]
    },
    {
      text: "Как вы относитесь к порядку?",
      options: [
        "Порядок — это важно, но иногда можно и запутаться.",
        "Порядок? У меня все под контролем, даже если это хаос!",
        "Порядок — это скучно, главное — вдохновение!",
        "Порядок — это хорошо, но главное — это люди.",
        "Порядок — это часть природы, как смена времен года.",
        "Порядок — это необходимость для работы.",
        "Порядок — это весело, если это творческий беспорядок.",
        "Порядок — это результат тяжелого труда."
      ]
    },
    {
      text: "Как вы относитесь к риску?",
      options: [
        "Риск — это не мое, я предпочитаю расчет.",
        "Риск — это адреналин, я обожаю рисковать!",
        "Риск — это возможность для творчества.",
        "Риск — это опасно, лучше быть осторожным.",
        "Риск — это часть природы, как шторм или гроза.",
        "Риск — это необходимость для изобретений.",
        "Риск — это веселье, если все закончится хорошо.",
        "Риск — это глупость, лучше работать усердно."
      ]
    },
    {
      text: "Как вы относитесь к дружбе?",
      options: [
        "Дружба — это важно, но у меня не так много друзей.",
        "У меня много друзей, и я всегда готов помочь!",
        "Дружба — это вдохновение.",
        "Дружба — это самое главное в жизни.",
        "Дружба — это часть природы, как стая птиц.",
        "Дружба — это хорошо, но я предпочитаю работать один.",
        "Дружба — это веселье и поддержка.",
        "Дружба — это важно, но труд важнее."
      ]
    }
  ];

  const handleAnswerChange = (value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestion] = value + 1;
      return newAnswers;
    });

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 500);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (answers.some((answer) => answer === null)) {
      alert("Пожалуйста, ответьте на все вопросы!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const score = answers.reduce((sum, answer) => sum + answer, 0);
      setTotalScore(score);
      setIsLoading(false);
    }, 1000);
  };

  const getResultText = () => {
    if (totalScore <= 10) return "Лосяш";
    if (totalScore <= 20) return "Крош";
    if (totalScore <= 30) return "Бараш";
    if (totalScore <= 40) return "Нюша";
    if (totalScore <= 50) return "Копатыч";
    if (totalScore <= 60) return "Пин";
    if (totalScore <= 70) return "Кар-Карыч";
    return "Ёжик";
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${darkMode ? "bg-purple-900 text-white" : "bg-gradient-to-br from-pink-100 to-yellow-100 text-black"}`}>
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight">
        Какой ты <span className="text-pink-500">Смешарик</span>?
      </h1>
  
      <div className="relative mb-6 max-w-2xl mx-auto">
        <div className="h-2 rounded-full bg-purple-300 overflow-hidden">
          <div
            className="h-full bg-pink-500 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm mt-2 text-center text-purple-700 font-medium">
          Вопрос {currentQuestion + 1} из {questions.length}
        </p>
      </div>
  
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`p-6 md:p-8 rounded-3xl shadow-xl max-w-3xl mx-auto ${
            darkMode ? "bg-purple-800" : "bg-white"
          }`}
        >
          <p className="font-semibold text-xl flex items-center mb-6">
            <FaQuestionCircle className="text-pink-500 mr-2" /> {questions[currentQuestion].text}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index + 1;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(index)}
                  className={`p-5 md:p-6 text-base rounded-2xl border font-medium transition-all duration-200 text-left ${
                    isSelected
                      ? "bg-pink-500 text-white border-pink-600 shadow-xl scale-105"
                      : `${darkMode ? "bg-purple-700 text-white border-purple-600 hover:bg-purple-600" : "bg-pink-100 border-pink-300 text-black hover:bg-pink-200"}`
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
  
      <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto gap-4">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-purple-500 text-white disabled:opacity-40"
        >
          Назад
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentQuestion === questions.length - 1}
          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-pink-500 text-white disabled:opacity-40"
        >
          Далее
        </button>
      </div>
  
      <div className="mt-10 flex justify-center">
        {isLoading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-pink-500"></div>
        ) : (
          <button
            onClick={calculateScore}
            disabled={answers.includes(null)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              answers.includes(null)
                ? "bg-purple-300 text-white cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500 text-white shadow-lg"
            }`}
          >
            Узнать результат
          </button>
        )}
      </div>
  
      {totalScore !== null && (
        <div className={`mt-10 p-6 rounded-3xl shadow-2xl text-center max-w-xl mx-auto ${darkMode ? "bg-purple-800" : "bg-yellow-100"}`}>
          <h2 className="text-3xl font-extrabold mb-4 text-pink-600">Ты —</h2>
          <p className="text-2xl font-semibold">{getResultText()}</p>
        </div>
      )}
  
      <div className="mt-8 flex justify-center">
        <Link to="/">
          <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all duration-200">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SmesharikiTest;