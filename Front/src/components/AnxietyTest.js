import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const AnxietyTest = ({ darkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    { text: "Как часто вы чувствуете беспокойство без видимой причины?", options: ["Почти никогда.", "Иногда, но это быстро проходит.", "Довольно часто.", "Постоянно, это мешает мне жить."] },
    { text: "Как вы реагируете на неожиданные изменения в планах?", options: ["Спокойно, я легко адаптируюсь.", "Немного нервничаю, но справляюсь.", "Чувствую сильное раздражение или тревогу.", "Паникую, мне сложно взять себя в руки."] },
    { text: "Как часто вы испытываете трудности с засыпанием из-за беспокойства?", options: ["Почти никогда.", "Иногда, но это редкое явление.", "Довольно часто.", "Каждую ночь, сон стал проблемой."] },
    { text: "Как вы чувствуете себя в социальных ситуациях?", options: ["Комфортно, я легко общаюсь.", "Иногда немного нервничаю, но это не мешает.", "Часто чувствую напряжение и неуверенность.", "Постоянно испытываю страх и избегаю общения."] },
    { text: "Как часто вы проверяете, выключили ли вы утюг, свет или закрыли дверь?", options: ["Почти никогда.", "Иногда, для уверенности.", "Довольно часто, чтобы успокоиться.", "Постоянно, это стало навязчивой привычкой."] },
    { text: "Как вы реагируете на критику?", options: ["Спокойно, я воспринимаю ее как обратную связь.", "Немного переживаю, но быстро забываю.", "Долго думаю об этом и чувствую себя плохо.", "Очень болезненно, это выбивает меня из колеи."] },
    { text: "Как часто вы чувствуете физические симптомы тревоги (учащенное сердцебиение, потливость, дрожь)?", options: ["Почти никогда.", "Редко, только в стрессовых ситуациях.", "Довольно часто.", "Постоянно, это стало частью моей жизни."] },
    { text: "Как вы относитесь к будущему?", options: ["Спокойно, я уверен(а) в себе.", "Иногда немного переживаю, но стараюсь не думать об этом.", "Часто чувствую беспокойство и страх.", "Постоянно думаю о худшем, это меня парализует."] },
    { text: "Как часто вы избегаете ситуаций, которые вызывают у вас тревогу?", options: ["Почти никогда.", "Иногда, если ситуация слишком стрессовая.", "Довольно часто.", "Постоянно, это ограничивает мою жизнь."] },
    { text: "Как вы справляетесь с трудностями?", options: ["Легко, я уверен(а) в своих силах.", "Иногда нервничаю, но нахожу решение.", "Часто чувствую себя подавленным(ой).", "Обычно впадаю в панику и не могу действовать."] },
    { text: "Как часто вы чувствуете себя уставшим(ой) без видимой причины?", options: ["Почти никогда.", "Иногда, но это быстро проходит.", "Довольно часто.", "Постоянно, усталость стала постоянной."] },
    { text: "Как вы относитесь к неопределенности?", options: ["Спокойно, я принимаю ее как часть жизни.", "Иногда немного нервничаю, но справляюсь.", "Чувствую сильное беспокойство.", "Не могу справиться, это вызывает панику."] },
    { text: "Как часто вы чувствуете, что не можете расслабиться?", options: ["Почти никогда.", "Иногда, но это быстро проходит.", "Довольно часто.", "Постоянно, расслабление стало невозможным."] },
    { text: "Как вы реагируете на мелкие неудачи?", options: ["Спокойно, это часть жизни.", "Немного расстраиваюсь, но быстро забываю.", "Долго переживаю и чувствую себя плохо.", "Очень болезненно, это выбивает меня из колеи."] },
    { text: "Как часто вы чувствуете себя раздраженным(ой) без причины?", options: ["Почти никогда.", "Иногда, но это быстро проходит.", "Довольно часто.", "Постоянно, раздражение стало нормой."] },
    { text: "Как вы относитесь к своим мыслям?", options: ["Спокойно, я контролирую их.", "Иногда они меня беспокоят, но я справляюсь.", "Часто чувствую, что мысли выходят из-под контроля.", "Постоянно, это вызывает сильную тревогу."] },
    { text: "Как часто вы чувствуете, что не можете сосредоточиться?", options: ["Почти никогда.", "Иногда, но это быстро проходит.", "Довольно часто.", "Постоянно, это мешает мне работать или учиться."] },
    { textn: "Как вы относитесь к своим страхам?", options: ["Спокойно, я их принимаю.", "Иногда они меня беспокоят, но я справляюсь.", "Часто чувствую, что страхи контролируют меня.", "Постоянно, это вызывает панику."] },
    { text: "Как часто вы чувствуете, что не можете справиться с ситуацией?", options: ["Почти никогда.", "Иногда, но я нахожу выход.", "Довольно часто.", "Постоянно, это вызывает чувство беспомощности."] },
    { text: "Как вы оцениваете общий уровень своей тревожности?", options: ["Низкий, я почти никогда не тревожусь.", "Умеренный, иногда я чувствую беспокойство.", "Высокий, я часто испытываю тревогу.", "Очень высокий, тревога стала частью моей жизни."] },
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
      if (totalScore <= 15) return "Низкий уровень тревожности. Вы спокойны и уверены в себе.";
      if (totalScore <= 30) return "Умеренный уровень тревожности. Иногда вы чувствуете беспокойство, но в целом справляетесь.";
      if (totalScore <= 45) return "Высокий уровень тревожности. Вам стоит обратить внимание на свое состояние и, возможно, обратиться за помощью.";
      return "Очень высокий уровень тревожности. Тревога значительно влияет на вашу жизнь, и вам важно обратиться к специалисту.";
    };
  
    return (
      <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <h1 className="text-3xl font-bold text-center mb-6">Тест на тревожность</h1>
  
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
  
  export default AnxietyTest;