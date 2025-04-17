import React from "react";
import { FaQuestionCircle, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const TestLayout = ({ 
  darkMode, 
  title, 
  currentQuestion, 
  totalQuestions, 
  children, 
  onPrev, 
  onNext, 
  onSubmit, 
  isSubmitting, 
  canSubmit,
  showResults,
  results,
  onHome
}) => {
  return (
    <div className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>

      {showResults ? (
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          {results}
          <div className="mt-6">
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-lg ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white mr-4`}
            >
              Посмотреть в профиле
            </Link>
            <Link
              to="/tests"
              className={`px-4 py-2 rounded-lg ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              К списку тестов
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="relative pt-1 mb-4">
            <div className={`overflow-hidden h-4 mb-2 text-xs flex rounded ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}>
              <div
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
              ></div>
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Вопрос {currentQuestion + 1} из {totalQuestions}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-4">
            <button
              onClick={onPrev}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500 disabled:opacity-50" : "bg-gray-300 hover:bg-gray-400 disabled:opacity-50"}`}
            >
              <FaArrowLeft className="inline mr-1" /> Назад
            </button>
            {currentQuestion < totalQuestions - 1 ? (
              <button
                onClick={onNext}
                className={`px-4 py-2 rounded ${darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              >
                Далее <FaArrowRight className="inline ml-1" />
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isSubmitting || !canSubmit}
                className={`px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-500 disabled:opacity-50" : "bg-green-600 hover:bg-green-700 disabled:opacity-50"} text-white`}
              >
                {isSubmitting ? "Отправка..." : "Завершить тест"}
              </button>
            )}
          </div>
        </>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onHome}
          className={`inline-flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          <FaHome className="mr-2" /> На главную
        </button>
      </div>
    </div>
  );
};

export default TestLayout;