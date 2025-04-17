import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const AnswerCard = ({ 
  option, 
  isSelected, 
  onSelect 
}) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: isSelected ? '' : '#f3f4f6' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`p-4 mb-3 rounded-lg cursor-pointer border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 border ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-2 w-2 rounded-full bg-white"
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
        <div className={`${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
          {option}
        </div>
      </div>
    </motion.div>
  );
};

const TestLayout = ({
  title = 'Тест',
  currentQuestion = 0,
  totalQuestions = 0,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
  canSubmit = false,
  showResults = false,
  results = null,
  currentQuestionData = null,
  answers = {},
  handleAnswerChange = () => {},
  isLoading = false,
  error = null
}) => {
  const progress = useMotionValue(0);
  const progressPercent = useTransform(progress, [0, 100], [0, 100]);

  useEffect(() => {
    if (totalQuestions > 0) {
      const newProgress = ((currentQuestion + 1) / totalQuestions) * 100;
      progress.set(newProgress);
    }
  }, [currentQuestion, totalQuestions, progress]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4 bg-gray-50">
        <div className="p-6 rounded-lg bg-white shadow-sm max-w-md text-center">
          <h2 className="text-xl font-medium mb-4 text-red-500">Ошибка</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4 bg-gray-50">
        <div className="p-6 rounded-lg bg-white shadow-sm max-w-md text-center">
          <h2 className="text-xl font-medium mb-4">Данные не загружены</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 h-full flex flex-col">
        {/* Прогресс-бар */}
        <div className="mb-6">
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: progressPercent }}
              initial={{ width: 0 }}
              animate={{ width: progressPercent }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>Вопрос {currentQuestion + 1} из {totalQuestions}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
        </div>

        {showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-4">Результат теста</h2>
                {results}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-lg font-medium mb-6">{currentQuestionData.text}</h3>
                  
                  <div className="space-y-3">
                    {currentQuestionData.options?.map((option, index) => (
                      <AnswerCard
                        key={index}
                        option={option}
                        isSelected={answers[currentQuestionData.id] === index}
                        onSelect={() => handleAnswerChange(currentQuestionData.id, index)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-auto">
              <button
                onClick={onPrev}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg ${currentQuestion === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaArrowLeft className="inline mr-1" /> Назад
              </button>
              
              {currentQuestion < totalQuestions - 1 ? (
                <button
                  onClick={onNext}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Далее <FaArrowRight className="inline ml-1" />
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  disabled={isSubmitting || !canSubmit}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Отправка...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaCheck className="mr-1" /> Завершить
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLayout;