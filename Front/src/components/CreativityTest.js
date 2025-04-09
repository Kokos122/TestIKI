import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const CreativityTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
      {
        text: "Как вы обычно решаете проблемы?",
        options: [
          "Ищу стандартное решение, которое уже проверено.",
          "Пробую разные подходы, пока не найду что-то подходящее.",
          "Ищу нестандартное решение, даже если оно кажется странным.",
          "Действую интуитивно, без четкого плана."
        ]
      },
      {
        text: "Как вы относитесь к новым идеям?",
        options: [
          "Предпочитаю проверенные методы.",
          "Интересуюсь новыми идеями, но не всегда их применяю.",
          "Всегда открыт(а) для новых идей и экспериментов.",
          "Новые идеи — это моя страсть, я постоянно их генерирую."
        ]
      },
      {
        text: "Как вы относитесь к ошибкам?",
        options: [
          "Стараюсь их избегать.",
          "Ошибки — это часть процесса, но я стараюсь их минимизировать.",
          "Ошибки — это возможность научиться чему-то новому.",
          "Ошибки — это часть творчества, я их не боюсь."
        ]
      },
      {
        text: "Как вы относитесь к рутине?",
        options: [
          "Рутина — это комфортно и предсказуемо.",
          "Рутина — это скучно, но иногда необходима.",
          "Стараюсь разнообразить рутину.",
          "Рутина — это враг креативности, я её избегаю."
        ]
      },
      {
        text: "Как вы относитесь к неопределенности?",
        options: [
          "Неопределенность меня пугает.",
          "Неопределенность — это вызов, но я справляюсь.",
          "Неопределенность — это возможность для творчества.",
          "Неопределенность — это мой стимул для новых идей."
        ]
      },
      {
        text: "Как вы относитесь к критике?",
        options: [
          "Критика меня расстраивает.",
          "Критика — это полезно, но не всегда приятно.",
          "Критика — это возможность улучшить свои идеи.",
          "Критика — это часть процесса, я её не боюсь."
        ]
      },
      {
        text: "Как вы относитесь к работе в команде?",
        options: [
          "Предпочитаю работать самостоятельно.",
          "Работа в команде — это полезно, но не всегда комфортно.",
          "Люблю обмениваться идеями с другими.",
          "Команда — это источник вдохновения и новых идей."
        ]
      },
      {
        text: "Как вы относитесь к своим мечтам?",
        options: [
          "Мечты — это хорошо, но реальность важнее.",
          "Иногда мечтаю, но не всегда воплощаю мечты в жизнь.",
          "Мечты — это источник вдохновения.",
          "Мечты — это основа моих идей и проектов."
        ]
      },
      {
        text: "Как вы относитесь к экспериментам?",
        options: [
          "Эксперименты — это рискованно.",
          "Иногда экспериментирую, но осторожно.",
          "Люблю экспериментировать и пробовать новое.",
          "Эксперименты — это моя стихия."
        ]
      },
      {
        text: "Как вы относитесь к своим идеям?",
        options: [
          "Идеи — это хорошо, но не всегда реалистично.",
          "Иногда у меня бывают интересные идеи.",
          "Идеи — это мой главный ресурс.",
          "Я постоянно генерирую новые идеи."
        ]
      },
      {
        text: "Как вы относитесь к творчеству?",
        options: [
          "Творчество — это не мое.",
          "Иногда занимаюсь творчеством, но не часто.",
          "Творчество — это часть моей жизни.",
          "Творчество — это мой способ самовыражения."
        ]
      },
      {
        text: "Как вы относитесь к своим страхам?",
        options: [
          "Страхи меня ограничивают.",
          "Стараюсь преодолевать страхи, но не всегда получается.",
          "Страхи — это вызов, который я принимаю.",
          "Страхи — это часть творческого процесса."
        ]
      },
      {
        text: "Как вы относитесь к своим принципам?",
        options: [
          "Принципы — это важно, я всегда их придерживаюсь.",
          "Иногда готов(а) отступить от принципов ради результата.",
          "Принципы — это гибкие правила, которые можно менять.",
          "Принципы — это ограничения, я их избегаю."
        ]
      },
      {
        text: "Как вы относитесь к своим мечтам?",
        options: [
          "Мечты — это хорошо, но реальность важнее.",
          "Иногда мечтаю, но не всегда воплощаю мечты в жизнь.",
          "Мечты — это источник вдохновения.",
          "Мечты — это основа моих идей и проектов."
        ]
      },
      {
        text: "Как вы относитесь к своим идеям?",
        options: [
          "Идеи — это хорошо, но не всегда реалистично.",
          "Иногда у меня бывают интересные идеи.",
          "Идеи — это мой главный ресурс.",
          "Я постоянно генерирую новые идеи."
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
    if (totalScore <= 15) return "Ваша креативность пока слабо развита. Вы предпочитаете стабильность и проверенные методы. Попробуйте чаще выходить из зоны комфорта и экспериментировать.";
    if (totalScore <= 30) return "У вас есть потенциал для креативности, но вы не всегда его используете. Пробуйте чаще генерировать новые идеи и не бойтесь ошибок.";
    if (totalScore <= 45) return "Вы креативный человек! Вы любите экспериментировать и находить нестандартные решения. Продолжайте развивать свои способности.";
    return "Вы настоящий творец! Креативность — это ваша стихия. Вы постоянно генерируете новые идеи и не боитесь рисковать.";
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Тест на креативность</h1>

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

export default CreativityTest;
