import React, { useState } from "react";
import Header from "./Header.js";
import Sidebar from "./Sidebar.js";
import AuthModal from "./AuthModal.js";
import { AnimatePresence, motion } from "framer-motion"; // Добавляем AnimatePresence для плавных входов и выходов

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Состояние бокового меню
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Состояние модального окна

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen); // Переключаем состояние бокового меню
  };

  const handleAuthModalToggle = () => {
    setIsAuthModalOpen(!isAuthModalOpen); // Переключаем состояние модального окна
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false); // Закрываем боковое меню
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header с кнопкой для открытия бокового меню */}
      <Header onSidebarToggle={handleSidebarToggle} onProfileClick={handleAuthModalToggle} />

      {/* Sidebar - боковое меню */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        )}
      </AnimatePresence>

      {/* Auth Modal - модальное окно входа */}
      <AnimatePresence>
        {isAuthModalOpen && <AuthModal onClose={handleAuthModalToggle} />}
      </AnimatePresence>

      {/* Основное содержимое страницы */}
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }} // Начальная прозрачность
        animate={{ opacity: 1 }} // Прозрачность при открытии
        exit={{ opacity: 0 }} // Прозрачность при выходе
        transition={{ duration: 0.5 }} // Длительность анимации
      >
        <h1 className="text-3xl font-bold">Добро пожаловать на сайт!</h1>
        {/* Тут могут быть другие компоненты */}
      </motion.div>
    </div>
  );
};

export default App;
