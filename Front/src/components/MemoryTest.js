import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const MemoryTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      text: "Как часто вы забываете имена новых знакомых?",
      options: [
        "Почти всегда",
        "Иногда, особенно если людей много",
        "Редко, только если не сосредоточусь",
        "Практически никогда"
      ]
    },
    {
      text: "Как вы запоминаете важные даты (дни рождения, встречи)?",
      options: [
        "Полностью полагаюсь на напоминания в телефоне",
        "Иногда записываю, иногда полагаюсь на память",
        "Стараюсь запомнить, но иногда использую заметки",
        "Всегда запоминаю без напоминаний"
      ]
    },
    {
      text: "Как вы справляетесь с запоминанием списков (например, покупок)?",
      options: [
        "Всегда записываю, иначе забуду",
        "Иногда записываю, иногда полагаюсь на память",
        "Стараюсь запомнить, но иногда что-то упускаю",
        "Легко запоминаю списки без записей"
      ]
    },
    {
      text: "Как вы запоминаете прочитанную информацию?",
      options: [
        "Почти сразу забываю",
        "Запоминаю только ключевые моменты",
        "Запоминаю большую часть, если информация интересная",
        "Легко запоминаю детали и могу пересказать"
      ]
    },
    {
      text: "Как вы запоминаете маршруты в новом городе?",
      options: [
        "Всегда пользуюсь навигатором",
        "Иногда запоминаю, но часто теряюсь",
        "Обычно запоминаю после пары раз",
        "Легко запоминаю маршруты с первого раза"
      ]
    },
    {
      text: "Как вы запоминаете номера телефонов?",
      options: [
        "Не запоминаю, всегда пользуюсь контактами",
        "Запоминаю только самые важные номера",
        "Запоминаю, если часто набираю",
        "Легко запоминаю номера с первого раза"
      ]
    },
    {
      text: "Как вы запоминаете лица людей?",
      options: [
        "Часто забываю, даже если видел(а) их несколько раз",
        "Запоминаю, только если человек произвел впечатление",
        "Обычно запоминаю, но иногда путаю",
        "Легко запоминаю лица даже после одной встречи"
      ]
    },
    {
      text: "Как вы запоминаете информацию на работе или учебе?",
      options: [
        "Всегда делаю заметки, иначе забываю",
        "Запоминаю только самое важное",
        "Стараюсь запомнить, но иногда что-то упускаю",
        "Легко запоминаю детали и могу воспроизвести"
      ]
    },
    {
      text: "Как вы запоминаете сны?",
      options: [
        "Почти никогда не помню сны",
        "Иногда помню, но только отрывки",
        "Часто помню сны, особенно яркие",
        "Всегда помню сны в деталях"
      ]
    },
    {
      text: "Как вы запоминаете фильмы или книги?",
      options: [
        "Почти сразу забываю сюжет",
        "Запоминаю только основные моменты",
        "Запоминаю большую часть, если произведение интересное",
        "Легко запоминаю детали и могу пересказать"
      ]
    },
    {
      text: "Как вы запоминаете инструкции или указания?",
      options: [
        "Всегда записываю, иначе забуду",
        "Запоминаю только ключевые моменты",
        "Стараюсь запомнить, но иногда что-то упускаю",
        "Легко запоминаю и выполняю без напоминаний"
      ]
    },
    {
      text: "Как вы запоминаете события из прошлого?",
      options: [
        "Часто забываю даже важные события",
        "Запоминаю только самые яркие моменты",
        "Обычно помню, но иногда путаю детали",
        "Легко вспоминаю события в деталях"
      ]
    },
    {
      text: "Как вы запоминаете тексты песен?",
      options: [
        "Почти никогда не запоминаю",
        "Запоминаю только припев или несколько строк",
        "Запоминаю, если часто слушаю песню",
        "Легко запоминаю тексты с первого раза"
      ]
    },
    {
      text: "Как вы запоминаете информацию, которую услышали в разговоре?",
      options: [
        "Почти сразу забываю",
        "Запоминаю только ключевые моменты",
        "Обычно запоминаю, но иногда что-то упускаю",
        "Легко запоминаю детали и могу пересказать"
      ]
    },
    {
      text: "Как вы запоминаете свои планы на день?",
      options: [
        "Всегда записываю, иначе забуду",
        "Иногда записываю, иногда полагаюсь на память",
        "Стараюсь запомнить, но иногда что-то упускаю",
        "Легко запоминаю и выполняю без напоминаний"
      ]
    }
  ];

  const handleAnswerChange = (value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestion] = value + 1;
      return newAnswers;
    });
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
    if (totalScore <= 15) return "Ваша память нуждается в тренировке. Вы часто забываете важные вещи и полагаетесь на внешние напоминания. Попробуйте использовать техники запоминания, такие как ассоциации или повторение.";
    if (totalScore <= 30) return "У вас средний уровень памяти. Вы запоминаете ключевые моменты, но иногда что-то упускаете. Попробуйте чаще тренировать память, например, с помощью упражнений или игр.";
    if (totalScore <= 45) return "У вас хорошая память! Вы запоминаете большую часть информации, но иногда что-то может ускользнуть. Продолжайте тренировать память, чтобы улучшить её ещё больше.";
    return "У вас отличная память! Вы легко запоминаете детали и можете воспроизводить информацию без труда. Продолжайте поддерживать свою память в тонусе.";
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Тест на память</h1>

      <div className="relative pt-1 mb-4">
        <div className="overflow-hidden h-4 mb-2 text-xs flex rounded bg-gray-700">
          <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
        </div>
        <p className="text-sm text-gray-400">Вопрос {currentQuestion + 1} из {questions.length}</p>
      </div>

      <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className="font-semibold flex items-center text-lg">
          <FaQuestionCircle className="text-blue-500 mr-2" /> {questions[currentQuestion].text}
        </p>
        {questions[currentQuestion].options.map((option, index) => (
          <label key={index} className="block mt-3 cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              value={index}
              checked={answers[currentQuestion] === index + 1}
              onChange={() => handleAnswerChange(index)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={prevQuestion} disabled={currentQuestion === 0} className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50">Назад</button>
        <button onClick={nextQuestion} disabled={currentQuestion === questions.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Далее</button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <button onClick={calculateScore} className="w-full bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg mt-4">Рассчитать результат</button>
        )}
      </div>

      {totalScore !== null && (
        <div className={`mt-6 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold">Результат:</h2>
          <p className="text-xl">{getResultText()}</p>
          <Link to="/" className="flex items-center z-10"><button className="w-full bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg mt-4">Выйти на главную</button></Link>
        </div>
      )}
    </div>
  );
};

export default MemoryTest;
