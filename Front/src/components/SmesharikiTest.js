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
    if (totalScore <= 10) return "Вы — Лосяш";
    if (totalScore <= 20) return "Вы — Крош";
    if (totalScore <= 30) return "Вы — Бараш";
    if (totalScore <= 40) return "Вы — Нюша";
    if (totalScore <= 50) return "Вы — Копатыч";
    if (totalScore <= 60) return "Вы — Пин";
    if (totalScore <= 70) return "Вы — Кар-Карыч";
    return "Вы — Ёжик";
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Тест какой ты Смешарик?</h1>

      <div className="relative pt-1 mb-4">
        <div className="overflow-hidden h-4 mb-2 text-xs flex rounded bg-gray-700">
          <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
        </div>
        <p className="text-sm text-gray-400">Вопрос {currentQuestion + 1} из {questions.length}</p>
      </div>

      <AnimatePresence mode="wait">
  <motion.div
    key={currentQuestion}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
  >
    <p className="font-semibold flex items-center text-lg mb-4">
      <FaQuestionCircle className="text-blue-500 mr-2" /> {questions[currentQuestion].text}
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {questions[currentQuestion].options.map((option, index) => {
        const isSelected = answers[currentQuestion] === index + 1;
        return (
          <button
  key={index}
  onClick={() => handleAnswerChange(index)}
  className={`p-6 text-base sm:text-lg rounded-xl border transition-all duration-200 text-left ${
    isSelected
      ? "bg-blue-500 text-white border-blue-600 shadow-lg"
      : `${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 border-gray-300 text-black hover:bg-gray-200"}`
  }`}
>
  {option}
</button>
        );
      })}
    </div>
  </motion.div>
</AnimatePresence>

      <div className="flex justify-between mt-4">
  <button
    onClick={prevQuestion}
    disabled={currentQuestion === 0}
    className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-500 text-white disabled:opacity-50"
  >
    Назад
  </button>
  <button
    onClick={nextQuestion}
    disabled={currentQuestion === questions.length - 1}
    className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-blue-500 text-white disabled:opacity-50"
  >
    Далее
  </button>
</div>

<div className="mt-8 flex justify-center">
  {isLoading ? (
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  ) : (
    <button
      onClick={calculateScore}
      disabled={answers.includes(null)}
      className={`px-8 py-4 rounded-xl shadow-lg transition-all duration-200 font-semibold text-lg ${
        answers.includes(null)
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 text-white"
      }`}
    >
      Рассчитать результат
    </button>
  )}
</div>


      {totalScore !== null && (
        <div className={`mt-6 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold">Результат:</h2>
          <p className="text-xl">{getResultText()}</p>
          
        </div>
      )}
      <div className="mt-6">
  <Link to="/">
    <button className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-base">
      Выйти на главную
    </button>
  </Link>
</div>
    </div>
  );
};

export default SmesharikiTest;