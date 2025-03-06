import React, { useState } from "react";
import Header from "./Header.js";
import Sidebar from "./Sidebar.js";
import AuthModal from "./AuthModal.js";
import HomePage from "./HomePage.js";
import Footer from "./Footer.js"; 

import { AnimatePresence } from "framer-motion";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const handleAuthModalToggle = () => setIsAuthModalOpen(!isAuthModalOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Навигация */}
      <Header onSidebarToggle={handleSidebarToggle} onProfileClick={handleAuthModalToggle} />

      {/* Основное содержимое */}
      <div className="flex-grow">
        {/* Боковое меню */}
        <AnimatePresence>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />}
        </AnimatePresence>

        {/* Окно авторизации */}
        <AnimatePresence>
          {isAuthModalOpen && <AuthModal onClose={handleAuthModalToggle} />}
        </AnimatePresence>

        {/* Главная страница */}
        <HomePage />
      </div>

      {/* Футер */}
      <Footer />
    </div>
  );
};

export default App;
