
import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FaQuestionCircle } from "react-icons/fa";


const AnxietyTest = () => {
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question: "Как часто вы чувствуете беспокойство без видимой причины?",
      options: [
        "Почти никогда.",
        "Иногда, но это быстро проходит.",
        "Довольно часто.",
        "Постоянно, это мешает мне жить."
      ]
    },
    {
      question: "Как вы реагируете на неожиданные изменения в планах?",
      options: [
        "Спокойно, я легко адаптируюсь.",
        "Немного нервничаю, но справляюсь.",
        "Чувствую сильное раздражение или тревогу.",
        "Паникую, мне сложно взять себя в руки."
      ]
    },
    {
      question:
        "Как часто вы испытываете трудности с засыпанием из-за беспокойства?",
      options: [
        "Почти никогда.",
        "Иногда, но это редкое явление.",
        "Довольно часто.",
        "Каждую ночь, сон стал проблемой."
      ]
    },
    {
      question: "Как вы чувствуете себя в социальных ситуациях?",
      options: [
        "Комфортно, я легко общаюсь.",
        "Иногда немного нервничаю, но это не мешает.",
        "Часто чувствую напряжение и неуверенность.",
        "Постоянно испытываю страх и избегаю общения."
      ]
    },
    {
      question:
        "Как часто вы проверяете, выключили ли вы утюг, свет или закрыли дверь?",
      options: [
        "Почти никогда.",
        "Иногда, для уверенности.",
        "Довольно часто, чтобы успокоиться.",
        "Постоянно, это стало навязчивой привычкой."
      ]
    },
    {
      question: "Как вы реагируете на критику?",
      options: [
        "Спокойно, я воспринимаю ее как обратную связь.",
        "Немного переживаю, но быстро забываю.",
        "Долго думаю об этом и чувствую себя плохо.",
        "Очень болезненно, это выбивает меня из колеи."
      ]
    },
    {
      question:
        "Как часто вы чувствуете физические симптомы тревоги (учащенное сердцебиение, потливость, дрожь)?",
      options: [
        "Почти никогда.",
        "Редко, только в стрессовых ситуациях.",
        "Довольно часто.",
        "Постоянно, это стало частью моей жизни."
      ]
    },
    {
      question: "Как вы относитесь к будущему?",
      options: [
        "Спокойно, я уверен(а) в себе.",
        "Иногда немного переживаю, но стараюсь не думать об этом.",
        "Часто чувствую беспокойство и страх.",
        "Постоянно думаю о худшем, это меня парализует."
      ]
    },
    {
      question:
        "Как часто вы избегаете ситуаций, которые вызывают у вас тревогу?",
      options: [
        "Почти никогда.",
        "Иногда, если ситуация слишком стрессовая.",
        "Довольно часто.",
        "Постоянно, это ограничивает мою жизнь."
      ]
    },
    {
      question: "Как вы справляетесь с трудностями?",
      options: [
        "Легко, я уверен(а) в своих силах.",
        "Иногда нервничаю, но нахожу решение.",
        "Часто чувствую себя подавленным(ой).",
        "Обычно впадаю в панику и не могу действовать."
      ]
    },
    {
      question: "Как часто вы чувствуете себя уставшим(ой) без видимой причины?",
      options: [
        "Почти никогда.",
        "Иногда, но это быстро проходит.",
        "Довольно часто.",
        "Постоянно, усталость стала постоянной."
      ]
    },
    {
      question: "Как вы относитесь к неопределенности?",
      options: [
        "Спокойно, я принимаю ее как часть жизни.",
        "Иногда немного нервничаю, но справляюсь.",
        "Чувствую сильное беспокойство.",
        "Не могу справиться, это вызывает панику."
      ]
    },
    {
      question: "Как часто вы чувствуете, что не можете расслабиться?",
      options: [
        "Почти никогда.",
        "Иногда, но это быстро проходит.",
        "Довольно часто.",
        "Постоянно, расслабление стало невозможным."
      ]
    },
    {
      question: "Как вы реагируете на мелкие неудачи?",
      options: [
        "Спокойно, это часть жизни.",
        "Немного расстраиваюсь, но быстро забываю.",
        "Долго переживаю и чувствую себя плохо.",
        "Очень болезненно, это выбивает меня из колеи."
      ]
    },
    {
      question: "Как часто вы чувствуете себя раздраженным(ой) без причины?",
      options: [
        "Почти никогда.",
        "Иногда, но это быстро проходит.",
        "Довольно часто.",
        "Постоянно, раздражение стало нормой."
      ]
    },
    {
      question: "Как вы относитесь к своим мыслям?",
      options: [
        "Спокойно, я контролирую их.",
        "Иногда они меня беспокоят, но я справляюсь.",
        "Часто чувствую, что мысли выходят из-под контроля.",
        "Постоянно, это вызывает сильную тревогу."
      ]
    },
    {
      question: "Как часто вы чувствуете, что не можете сосредоточиться?",
      options: [
        "Почти никогда.",
        "Иногда, но это быстро проходит.",
        "Довольно часто.",
        "Постоянно, это мешает мне работать или учиться."
      ]
    },
    {
      question: "Как вы относитесь к своим страхам?",
      options: [
        "Спокойно, я их принимаю.",
        "Иногда они меня беспокоят, но я справляюсь.",
        "Часто чувствую, что страхи контролируют меня.",
        "Постоянно, это вызывает панику."
      ]
    },
    {
      question:
        "Как часто вы чувствуете, что не можете справиться с ситуацией?",
      options: [
        "Почти никогда.",
        "Иногда, но я нахожу выход.",
        "Довольно часто.",
        "Постоянно, это вызывает чувство беспомощности."
      ]
    },
    {
      question: "Как вы оцениваете общий уровень своей тревожности?",
      options: [
        "Низкий, я почти никогда не тревожусь.",
        "Умеренный, иногда я чувствую беспокойство.",
        "Высокий, я часто испытываю тревогу.",
        "Очень высокий, тревога стала частью моей жизни."
      ]
    }
  ];
  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers]; // Гарантированно создаём новый массив
      newAnswers[index] = value; 
      console.log(`Ответ на ${index + 1}:`, newAnswers); // Проверяем, правильно ли обновляется состояние
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
      return "😊 Низкий уровень тревожности. Вы спокойны и уверены в себе.";
    if (totalScore <= 30)
      return "😐 Умеренный уровень тревожности. Иногда вы чувствуете беспокойство, но в целом справляетесь.";
    if (totalScore <= 45)
      return "⚠️ Высокий уровень тревожности. Вам стоит обратить внимание на свое состояние и, возможно, обратиться за помощью.";
    return "🚨 Очень высокий уровень тревожности. Тревога значительно влияет на вашу жизнь, и вам важно обратиться к специалисту.";
  };

  const getBackgroundColor = () => {
    if (totalScore === null) return "bg-gradient-to-b from-blue-100 to-purple-200";
    if (totalScore <= 15) return "bg-green-100";
    if (totalScore <= 30) return "bg-yellow-100";
    if (totalScore <= 45) return "bg-orange-100";
    return "bg-red-100";
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
        Тест на тревожность
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

export default AnxietyTest;