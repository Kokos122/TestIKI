import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FaQuestionCircle } from "react-icons/fa";

const LogicTest = () => {
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question:
        "Если все вороны черные, а эта птица черная, то она ворона?",
      options: ["Да.", "Нет.", "Недостаточно информации.", "Возможно."]
    },
    {
      question: "Продолжите последовательность: 2, 4, 8, 16, ...",
      options: ["18.", "24.", "32.", "64."]
    },
    {
      question: "Если сегодня понедельник, то какой день будет через 25 дней?",
      options: ["Вторник.", "Среда.", "Четверг.", "Пятница."]
    },
    {
      question:
        "У Маши есть три корзины: в одной яблоки, в другой апельсины, а в третьей — и яблоки, и апельсины. На каждой корзине есть надпись, но все надписи неправильные. Надпись на первой корзине: 'Яблоки'. На второй: 'Апельсины'. На третьей: 'Яблоки и апельсины'. Что лежит в третьей корзине?",
      options: [
        "Яблоки.",
        "Апельсины.",
        "Яблоки и апельсины.",
        "Ничего."
      ]
    },
    {
      question:
        "Если все тигры — кошки, а некоторые кошки — полосатые, то какие из утверждений верны?",
      options: [
        "Все тигры полосатые.",
        "Некоторые тигры полосатые.",
        "Ни один тигр не полосатый.",
        "Некоторые полосатые — тигры."
      ]
    },
    {
      question: "Продолжите последовательность: А, В, Г, Д, ...",
      options: ["Е.", "Ж.", "З.", "И."]
    },
    {
      question:
        "Если 3 человека могут построить дом за 6 дней, то сколько дней понадобится 6 человекам?",
      options: ["3 дня.", "6 дней.", "12 дней.", "18 дней."]
    },
    {
      question: "Что легче: килограмм пуха или килограмм железа?",
      options: [
        "Килограмм пуха.",
        "Килограмм железа.",
        "Они весят одинаково.",
        "Зависит от объема."
      ]
    },
    {
      question:
        "Если на дереве сидят 5 птиц, и 3 из них улетают, сколько птиц останется?",
      options: ["2.", "3.", "5.", "Ни одной."]
    },
    {
      question:
        "Какое число должно быть следующим в последовательности: 1, 1, 2, 3, 5, 8, ...?",
      options: ["10.", "12.", "13.", "15."]
    },
    {
      question:
        "Если все розы — цветы, а некоторые цветы быстро вянут, то какие из утверждений верны?",
      options: [
        "Все розы быстро вянут.",
        "Некоторые розы быстро вянут.",
        "Ни одна роза не вянет.",
        "Некоторые цветы, которые быстро вянут, — розы."
      ]
    },
    {
      question:
        "Если 5 машин производят 5 деталей за 5 минут, то сколько деталей произведут 100 машин за 100 минут?",
      options: ["100.", "500.", "1000.", "2000."]
    },
    {
      question:
        "Что будет следующим в последовательности: круг, квадрат, треугольник, ...?",
      options: ["Прямоугольник.", "Ромб.", "Пятиугольник.", "Овал."]
    },
    {
      question:
        "Если у вас есть две монеты на общую сумму 15 рублей, и одна из них не пятирублевая, то какие это монеты?",
      options: ["5 и 10 рублей.", "1 и 14 рублей.", "2 и 13 рублей.", "7 и 8 рублей."]
    },
    {
      question:
        "Если все книги на полке — учебники, а некоторые учебники — новые, то какие из утверждений верны?",
      options: [
        "Все книги новые.",
        "Некоторые книги новые.",
        "Ни одна книга не новая.",
        "Некоторые новые книги — учебники."
      ]
    }
  ];

  const correctAnswers = [
    2, // Вопрос 1
    2, // Вопрос 2
    3, // Вопрос 3
    1, // Вопрос 4
    1, // Вопрос 5
    1, // Вопрос 6
    0, // Вопрос 7
    2, // Вопрос 8
    2, // Вопрос 9
    2, // Вопрос 10
    1, // Вопрос 11
    3, // Вопрос 12
    2, // Вопрос 13
    0, // Вопрос 14
    1  // Вопрос 15
  ];

  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      console.log(`Ответ на ${index + 1}:`, newAnswers); // Отладочная информация
      return newAnswers;
    });
  };

  const calculateScore = () => {
    console.log("Текущие ответы перед проверкой:", answers);
    if (answers.some((answer) => answer === null)) {
      alert("Пожалуйста, ответьте на все вопросы!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const score = answers.reduce(
        (sum, answer, index) => sum + (answer === correctAnswers[index] ? 1 : 0),
        0
      );
      setTotalScore(score);
      setIsLoading(false);
    }, 1000);
  };

  const getResultMessage = () => {
    if (totalScore === null) return "";
    if (totalScore <= 5)
      return "Вам стоит потренировать логическое мышление.";
    if (totalScore <= 10)
      return "У вас хорошие логические способности.";
    return "Вы отлично справляетесь с логическими задачами!";
  };

  const getBackgroundColor = () => {
    if (totalScore === null) return "bg-gradient-to-b from-blue-100 to-purple-200";
    if (totalScore <= 5) return "bg-red-100";
    if (totalScore <= 10) return "bg-yellow-100";
    return "bg-green-100";
  };

  const answeredCount = answers.filter((answer) => answer !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div
      className={`container mx-auto p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : getBackgroundColor()
      }`}
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
      >
        {isDarkMode ? "Светлая тема" : "Темная тема"}
      </button>

      <h1
        className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ WebkitBackgroundClip: "text" }}
      >
        Тест на логическое мышление
      </h1>

      <div className="mb-4">
        <div className="relative pt-1">
          <div className="overflow-hidden h-4 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500"
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{`Отвечено на ${answeredCount} из ${questions.length} вопросов`}</p>
        </div>
      </div>

      <TransitionGroup className="space-y-6">
        {questions.map((q, index) => (
          <CSSTransition key={index} timeout={300} classNames="fade">
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-transform duration-200 ${
                isDarkMode
                  ? "bg-gray-800 bg-opacity-80 border border-gray-700"
                  : "bg-white bg-opacity-80 border border-gray-200"
              }`}
            >
              <p className="font-semibold flex items-center text-lg">
                <FaQuestionCircle className="text-blue-500 mr-2" /> {`${index + 1}. ${q.question}`}
              </p>
              {q.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="block mt-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optionIndex}
                    checked={answers[index] === optionIndex}
                    onChange={() => handleAnswerChange(index, optionIndex)}
                    className="mr-2"
                  />
                  <span
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <button
            onClick={calculateScore}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform duration-200"
          >
            Рассчитать результат
          </button>
        )}
      </div>

      {totalScore !== null && (
        <div
          className={`mt-6 p-6 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-200 ${
            isDarkMode
              ? "bg-gray-800 bg-opacity-80 border border-gray-700 text-gray-300"
              : "bg-white bg-opacity-80 border border-gray-200 text-gray-800"
          }`}
        >
          <h2 className="text-2xl font-bold">Результат:</h2>
          <p className="text-xl">{`Вы набрали ${totalScore} баллов.`}</p>
          <p className="text-lg">{getResultMessage()}</p>
        </div>
      )}

      <style>
        {`
          .fade-enter {
            opacity: 0;
            transform: translateY(-20px);
          }
          .fade-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 300ms, transform 300ms;
          }
          .fade-exit {
            opacity: 1;
          }
          .fade-exit-active {
            opacity: 0;
            transition: opacity 300ms;
          }
        `}
      </style>
    </div>
  );
};

export default LogicTest;