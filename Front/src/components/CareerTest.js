
import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const CareerTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      text: "Что вам больше нравится делать в свободное время?",
      options: [
        "Читать книги, изучать что-то новое.",
        "Заниматься спортом или активными играми.",
        "Рисовать, писать, заниматься творчеством.",
        "Помогать друзьям или решать их проблемы."
      ]
    },
    {
      text: "Как вы относитесь к работе с числами и расчетами?",
      options: [
        "Обожаю, это мое любимое занятие.",
        "Иногда интересно, но не всегда.",
        "Предпочитаю избегать этого.",
        "Мне нравится, если это связано с практическими задачами."
      ]
    },
    {
      text: "Как вы ведете себя в команде?",
      options: [
        "Я предпочитаю работать самостоятельно.",
        "Я люблю быть лидером и организовывать других.",
        "Мне нравится сотрудничать и делиться идеями.",
        "Я помогаю другим и поддерживаю командный дух."
      ]
    },
    {
      text: "Как вы относитесь к технике и новым технологиям?",
      options: [
        "Мне интересно разбираться в технических устройствах.",
        "Я использую технологии, но не углубляюсь в них.",
        "Техника — это не мое, я предпочитаю творчество.",
        "Мне нравится применять технологии для решения задач."
      ]
    },
    {
      text: "Как вы справляетесь с неожиданными проблемами?",
      options: [
        "Анализирую ситуацию и ищу логическое решение.",
        "Действую быстро и решительно.",
        "Ищу креативный подход.",
        "Стараюсь успокоить всех и найти компромисс."
      ]
    },
    {
      text: "Как вы относитесь к искусству и творчеству?",
      options: [
        "Это интересно, но не мое главное увлечение.",
        "Я люблю творить, но не считаю это профессией.",
        "Творчество — это моя страсть!",
        "Мне нравится, если это приносит пользу другим."
      ]
    },
    {
      text: "Как вы относитесь к работе с людьми?",
      options: [
        "Я предпочитаю минимум общения.",
        "Мне нравится руководить и вдохновлять других.",
        "Я люблю общаться, но не в больших группах.",
        "Мне нравится помогать и поддерживать людей."
      ]
    },
    {
      text: "Как вы относитесь к природе и экологии?",
      options: [
        "Мне интересно изучать природу с научной точки зрения.",
        "Я люблю активный отдых на природе.",
        "Природа — это источник вдохновения для меня.",
        "Мне важно заботиться об окружающей среде."
      ]
    },
    {
      text: "Как вы относитесь к рутинной работе?",
      options: [
        "Мне нравится, когда все структурировано и понятно.",
        "Рутина — это скучно, я предпочитаю динамику.",
        "Рутина убивает мою креативность.",
        "Рутина — это нормально, если она приносит пользу."
      ]
    },
    {
      text: "Как вы относитесь к публичным выступлениям?",
      options: [
        "Я не люблю выступать перед людьми.",
        "Мне нравится быть в центре внимания.",
        "Я могу выступать, если это связано с творчеством.",
        "Я выступаю, если это помогает другим."
      ]
    },
    {
      text: "Как вы относитесь к исследованиям и открытиям?",
      options: [
        "Это моя страсть!",
        "Мне интересно, но только если это применимо на практике.",
        "Исследования — это скучно, я предпочитаю творить.",
        "Мне нравится, если исследования помогают людям."
      ]
    },
    {
      text: "Как вы относитесь к работе с большими объемами информации?",
      options: [
        "Мне нравится анализировать данные.",
        "Я предпочитаю работать с конкретными задачами.",
        "Большие объемы информации меня утомляют.",
        "Мне нравится, если информация полезна для других."
      ]
    },
    {
      text: "Как вы относитесь к работе в условиях стресса?",
      options: [
        "Я спокойно справляюсь со стрессом.",
        "Стресc — это вызов, который меня мотивирует.",
        "Стресс мешает мне творить.",
        "Я стараюсь избегать стрессовых ситуаций."
      ]
    },
    {
      text: "Как вы относитесь к работе, требующей физической активности?",
      options: [
        "Я предпочитаю умственный труд.",
        "Мне нравится, если работа динамичная.",
        "Физическая активность — это не мое.",
        "Мне нравится, если работа приносит пользу другим."
      ]
    },
    {
      text: "Как вы относитесь к работе, связанной с путешествиями?",
      options: [
        "Мне нравится, если это связано с исследованиями.",
        "Я обожаю путешествовать и открывать новое.",
        "Путешествия — это вдохновение для меня.",
        "Мне нравится, если путешествия помогают другим."
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
    if (totalScore <= 15) return "Вам подходят профессии, связанные с наукой, анализом и технологиями (ученый, аналитик, программист).";
    if (totalScore <= 30) return "Вам подходят профессии, связанные с лидерством, управлением и активной деятельностью (менеджер, предприниматель, спортсмен).";
    if (totalScore <= 45) return "Вам подходят творческие профессии, связанные с искусством и самовыражением (художник, писатель, дизайнер).";
    return "Вам подходят профессии, связанные с помощью людям и социальной работой (психолог, учитель, врач).";
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Тест на профориентацию</h1>

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

export default CareerTest;
