import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FaQuestionCircle } from "react-icons/fa";

const SmesharikiTest = () => {
  const [answers, setAnswers] = useState(Array(8).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question: "Какой ваш любимый способ провести выходной?",
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
      question: "Как вы реагируете на неожиданные проблемы?",
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
      question: "Что для вас самое важное в жизни?",
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
      question: "Как вы относитесь к спорту?",
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
      question: "Как вы относитесь к искусству?",
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
      question: "Как вы относитесь к порядку?",
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
      question: "Как вы относитесь к риску?",
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
      question: "Как вы относитесь к дружбе?",
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
      const score = answers.reduce((sum, answer) => sum + answer, 0);
      setTotalScore(score);
      setIsLoading(false);
    }, 1000);
  };

  const getResultMessage = () => {
    if (totalScore === null) return "";
    if (totalScore <= 10) return "Вы — Лосяш!";
    if (totalScore <= 20) return "Вы — Крош!";
    if (totalScore <= 30) return "Вы — Бараш!";
    if (totalScore <= 40) return "Вы — Нюша!";
    if (totalScore <= 50) return "Вы — Копатыч!";
    if (totalScore <= 60) return "Вы — Пин!";
    if (totalScore <= 70) return "Вы — Кар-Карыч!";
    return "Вы — Ёжик!";
  };

  const getBackgroundColor = () => {
    if (totalScore === null) return "bg-gradient-to-b from-blue-100 to-purple-200";
    if (totalScore <= 10) return "bg-green-100";
    if (totalScore <= 20) return "bg-yellow-100";
    if (totalScore <= 30) return "bg-orange-100";
    if (totalScore <= 40) return "bg-red-100";
    if (totalScore <= 50) return "bg-blue-100";
    if (totalScore <= 60) return "bg-indigo-100";
    if (totalScore <= 70) return "bg-pink-100";
    return "bg-gray-100";
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

      <h1
        className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ WebkitBackgroundClip: "text" }}
      >
        Тест: Какой вы Смешарик?
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

export default SmesharikiTest;