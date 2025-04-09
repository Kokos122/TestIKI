import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const DuneTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      text: "Как вы относитесь к лидерству?",
      options: [
        "Я готов(а) взять на себя ответственность и вести за собой других.",
        "Я предпочитаю поддерживать лидера и помогать ему.",
        "Я действую независимо и не нуждаюсь в лидере.",
        "Я стремлюсь к власти и контролю над другими."
      ]
    },
    {
      text: "Как вы справляетесь с трудностями?",
      options: [
        "Я анализирую ситуацию и ищу стратегическое решение.",
        "Я полагаюсь на свою интуицию и внутреннюю силу.",
        "Я действую быстро и решительно, даже если это рискованно.",
        "Я использую силу и хитрость, чтобы добиться своего."
      ]
    },
    {
      text: "Как вы относитесь к своим врагам?",
      options: [
        "Я стараюсь понять их мотивы и найти мирное решение.",
        "Я защищаю себя и своих близких, если это необходимо.",
        "Я действую жестко и без колебаний.",
        "Я уничтожаю врагов, чтобы они больше не представляли угрозы."
      ]
    },
    {
      text: "Как вы относитесь к своим друзьям и семье?",
      options: [
        "Я готов(а) на все, чтобы защитить их.",
        "Я поддерживаю их и помогаю им раскрыть их потенциал.",
        "Я верен(а) своим друзьям, но предпочитаю действовать самостоятельно.",
        "Я использую их для достижения своих целей."
      ]
    },
    {
      text: "Как вы относитесь к своей судьбе?",
      options: [
        "Я верю, что у меня есть великое предназначение.",
        "Я стараюсь следовать своему пути, несмотря на трудности.",
        "Я сам(а) создаю свою судьбу.",
        "Я не верю в судьбу, я верю только в силу."
      ]
    },
    {
      text: "Как вы относитесь к риску?",
      options: [
        "Я готов(а) рискнуть, если это необходимо для великой цели.",
        "Я осторожен(на), но иногда иду на риск ради близких.",
        "Риск — это часть моей жизни, я привык(ла) к нему.",
        "Я использую риск как инструмент для достижения власти."
      ]
    },
    {
      text: "Как вы относитесь к знаниям и обучению?",
      options: [
        "Я постоянно учусь и стремлюсь к новым знаниям.",
        "Я ценю мудрость и стараюсь передать ее другим.",
        "Я учусь на практике и доверяю своему опыту.",
        "Я использую знания, чтобы манипулировать другими."
      ]
    },
    {
      text: "Как вы относитесь к природе и окружающей среде?",
      options: [
        "Я уважаю природу и стараюсь жить в гармонии с ней.",
        "Я вижу в природе источник силы и вдохновения.",
        "Я использую природу для своих нужд.",
        "Я подчиняю природу своим целям."
      ]
    },
    {
      text: "Как вы относитесь к своим страхам?",
      options: [
        "Я преодолеваю свои страхи и становлюсь сильнее.",
        "Я принимаю свои страхи и стараюсь их понять.",
        "Я не боюсь ничего, я действую решительно.",
        "Я использую страхи других против них."
      ]
    },
    {
      text: "Как вы относитесь к своим принципам?",
      options: [
        "Я всегда придерживаюсь своих принципов, даже если это трудно.",
        "Я гибок(а) и готов(а) адаптироваться, но не теряю себя.",
        "Я действую по ситуации, принципы вторичны.",
        "У меня нет принципов, только цели."
      ]
    },
    {
      text: "Как вы относитесь к своим мечтам?",
      options: [
        "Я верю, что мои мечты могут изменить мир.",
        "Я стремлюсь к своим мечтам, но не забываю о реальности.",
        "Я сам(а) создаю свою реальность, мечты — это лишь начало.",
        "Мечты — это слабость, я действую ради власти."
      ]
    },
    {
      text: "Как вы относитесь к своим врагам?",
      options: [
        "Я стараюсь понять их и найти мирное решение.",
        "Я защищаю себя и своих близких, если это необходимо.",
        "Я действую жестко и без колебаний.",
        "Я уничтожаю врагов, чтобы они больше не представляли угрозы."
      ]
    },
    {
      text: "Как вы относитесь к своим друзьям и семье?",
      options: [
        "Я готов(а) на все, чтобы защитить их.",
        "Я поддерживаю их и помогаю им раскрыть их потенциал.",
        "Я верен(а) своим друзьям, но предпочитаю действовать самостоятельно.",
        "Я использую их для достижения своих целей."
      ]
    },
    {
      text: "Как вы относитесь к своей судьбе?",
      options: [
        "Я верю, что у меня есть великое предназначение.",
        "Я стараюсь следовать своему пути, несмотря на трудности.",
        "Я сам(а) создаю свою судьбу.",
        "Я не верю в судьбу, я верю только в силу."
      ]
    },
    {
      text: "Как вы относитесь к риску?",
      options: [
        "Я готов(а) рискнуть, если это необходимо для великой цели.",
        "Я осторожен(на), но иногда иду на риск ради близких.",
        "Риск — это часть моей жизни, я привык(ла) к нему.",
        "Я использую риск как инструмент для достижения власти."
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
    if (totalScore <= 15) return "Вы — Пол Атрейдес! Вы прирожденный лидер с великим предназначением, готовый вести других к светлому будущему.";
    if (totalScore <= 30) return "Вы — Леди Джессика! Вы мудры, интуитивны и всегда готовы поддержать своих близких.";
    if (totalScore <= 45) return "Вы — Чанни! Вы независимы, сильны и готовы идти на риск ради своих целей.";
    return "Вы — Барон Владимир Харконнен! Вы стремитесь к власти и готовы использовать любые средства для ее достижения.";
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Тест ты из Дюны</h1>

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

export default DuneTest;
