import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FaQuestionCircle } from "react-icons/fa";

const LoveTest = () => {
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question: "Как часто вы думаете о человеке, который вам нравится?",
      options: [
        "Постоянно, он(а) не выходит у меня из головы.",
        "Часто, но не все время.",
        "Иногда, когда что-то напоминает о нем(ней).",
        "Редко, только в конкретных ситуациях."
      ]
    },
    {
      question: "Как вы себя чувствуете, когда видите этого человека?",
      options: [
        "У меня учащается сердцебиение, и я теряю дар речи.",
        "Я чувствую себя счастливым(ой) и взволнованным(ой).",
        "Мне приятно, но я остаюсь спокойным(ой).",
        "Ничего особенного, просто нормальное общение."
      ]
    },
    {
      question: "Как вы реагируете на сообщения от этого человека?",
      options: [
        "Отвечаю сразу, даже если занят(а).",
        "Отвечаю быстро, но стараюсь не казаться слишком навязчивым(ой).",
        "Отвечаю, когда есть время.",
        "Отвечаю, если это важно."
      ]
    },
    {
      question: "Как вы относитесь к его(ее) недостаткам?",
      options: [
        "Они кажутся мне милыми и незначительными.",
        "Я их замечаю, но они меня не беспокоят.",
        "Иногда они раздражают, но я стараюсь не обращать внимания.",
        "Они меня сильно беспокоят."
      ]
    },
    {
      question:
        "Как вы планируете свое время, если знаете, что увидите этого человека?",
      options: [
        "Стараюсь освободить весь день, чтобы провести с ним(ней) больше времени.",
        "Планирую встречу заранее и с нетерпением жду.",
        "Если получится встретиться — хорошо, если нет — тоже нормально.",
        "Не планирую ничего особенного."
      ]
    },
    {
      question: "Как вы относитесь к его(ее) интересам и увлечениям?",
      options: [
        "Я стараюсь узнать о них как можно больше и разделить их.",
        "Мне интересно, но я не всегда вникаю.",
        "Иногда интересно, иногда нет.",
        "Меня это не особо волнует."
      ]
    },
    {
      question: "Как вы себя чувствуете, когда этот человек рядом с кем-то другим?",
      options: [
        "Я ревную и чувствую себя некомфортно.",
        "Мне немного неприятно, но я стараюсь не показывать.",
        "Мне все равно, я спокоен(а).",
        "Я даже не замечаю."
      ]
    },
    {
      question: "Как вы относитесь к его(ее) мнению?",
      options: [
        "Его(ее) мнение для меня очень важно, я всегда его(ее) слушаю.",
        "Я учитываю его(ее) мнение, но не всегда соглашаюсь.",
        "Иногда прислушиваюсь, иногда нет.",
        "Мне все равно."
      ]
    },
    {
      question: "Как вы себя чувствуете, когда этот человек улыбается вам?",
      options: [
        "Я чувствую себя на седьмом небе от счастья.",
        "Мне становится тепло и приятно.",
        "Мне приятно, но я не придаю этому большого значения.",
        "Ничего особенного."
      ]
    },
    {
      question: "Как вы относитесь к его(ее) друзьям и близким?",
      options: [
        "Я стараюсь понравиться им и стать частью его(ее) круга.",
        "Мне интересно познакомиться с ними, но без фанатизма.",
        "Я общаюсь с ними, если это необходимо.",
        "Меня это не интересует."
      ]
    },
    {
      question: "Как вы относитесь к его(ее) прошлому?",
      options: [
        "Мне интересно все, что связано с ним(ней).",
        "Я спрашиваю, но не углубляюсь.",
        "Иногда интересно, иногда нет.",
        "Меня это не волнует."
      ]
    },
    {
      question: "Как вы себя чувствуете, когда этот человек грустит?",
      options: [
        "Я стараюсь сделать все, чтобы его(ее) поддержать.",
        "Мне неприятно, и я пытаюсь помочь.",
        "Я сочувствую, но не всегда знаю, как помочь.",
        "Меня это не особо трогает."
      ]
    },
    {
      question: "Как вы относитесь к его(ее) успехам?",
      options: [
        "Я горжусь им(ей) и радуюсь за него(нее).",
        "Мне приятно, и я поздравляю его(ее).",
        "Иногда радуюсь, иногда нет.",
        "Меня это не волнует."
      ]
    },
    {
      question: "Как вы представляете ваше будущее с этим человеком?",
      options: [
        "Я часто мечтаю о нашем будущем вместе.",
        "Иногда думаю об этом, но без фанатизма.",
        "Редко задумываюсь об этом.",
        "Я не думаю об этом."
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
    if (totalScore <= 15)
      return "Вы не испытываете сильных чувств к этому человеку. Возможно, это просто симпатия или дружба.";
    if (totalScore <= 30)
      return "Вы испытываете симпатию и интерес, но это еще не глубокая влюбленность.";
    if (totalScore <= 45)
      return "Вы явно влюблены! Ваши чувства сильны, и вы думаете об этом человеке постоянно.";
    return "Вы безумно влюблены! Этот человек занимает все ваши мысли, и вы готовы(а) на многое ради него(нее).";
  };

  const getBackgroundColor = () => {
    if (totalScore === null) return "bg-gradient-to-b from-blue-100 to-purple-200";
    if (totalScore <= 15) return "bg-red-100";
    if (totalScore <= 30) return "bg-yellow-100";
    if (totalScore <= 45) return "bg-green-100";
    return "bg-pink-100";
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
        Тест: На сколько вы влюблены?
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

export default LoveTest;