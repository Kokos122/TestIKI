import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const WalkingDeadTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      text: "Как вы относитесь к лидерству?",
      options: [
        "Я готов(а) взять на себя ответственность и вести за собой других.",
        "Я предпочитаю действовать независимо, но могу поддержать лидера.",
        "Я не стремлюсь к лидерству, но готов(а) помогать своей группе.",
        "Я предпочитаю следовать за сильным лидером."
      ]
    },
    {
      text: "Как вы справляетесь с опасными ситуациями?",
      options: [
        "Я действую быстро и решительно, даже если это рискованно.",
        "Я полагаюсь на свои навыки и инстинкты.",
        "Я стараюсь найти безопасное решение и защитить других.",
        "Я использую хитрость и силу, чтобы выжить."
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
    },
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
    if (totalScore <= 15) return "Вы — Рик Граймс: прирожденный лидер, готовый вести других и защищать своих близких.";
    if (totalScore <= 30) return "Вы — Дэрил Диксон: независимы, сильны и готовы идти на риск ради своих целей.";
    if (totalScore <= 45) return "Вы — Мишонн: мудры, интуитивны и всегда готовы поддержать своих близких.";
    return "Вы — Неган: стремитесь к власти и готовы использовать любые средства для ее достижения.";
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight">
        Кто ты в мире <span className="text-red-600">Ходячих мертвецов</span>?
      </h1>
  
      <div className="relative mb-6">
        <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">
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
          className={`p-6 md:p-8 rounded-2xl shadow-xl ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <p className="font-semibold text-xl flex items-center mb-6">
            <FaQuestionCircle className="text-red-500 mr-2" /> {questions[currentQuestion].text}
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
                      ? "bg-red-500 text-white border-red-600 shadow-lg scale-105"
                      : `${darkMode ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : "bg-white border-gray-300 text-black hover:bg-gray-200"}`
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
  
      <div className="flex justify-between items-center mt-8 gap-4">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gray-500 text-white disabled:opacity-40"
        >
          Назад
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentQuestion === questions.length - 1}
          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-red-500 text-white disabled:opacity-40"
        >
          Далее
        </button>
      </div>
  
      {!answers.includes(null) && (
  <div className="mt-10 flex justify-center">
    {isLoading ? (
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-red-500"></div>
    ) : (
      <button
        onClick={calculateScore}
        className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-green-600 hover:bg-green-700 text-white shadow-lg"
      >
        Посмотреть результат
      </button>
    )}
  </div>
)}
  
      {totalScore !== null && (
        <div className={`mt-10 p-6 rounded-2xl shadow-2xl text-center ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <h2 className="text-3xl font-extrabold mb-4 text-green-500">Ваш результат</h2>
          <p className="text-xl">{getResultText()}</p>
        </div>
      )}
  
      <div className="mt-8 flex justify-center">
        <Link to="/">
          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WalkingDeadTest;
