import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./Header.js";
import Sidebar from "./Sidebar.js";
import AuthModal from "./AuthModal.js";
import HomePage from "./HomePage.js";
import Footer from "./Footer.js";
import About_Us from "./About_Us.jsx";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const handleAuthModalToggle = () => setIsAuthModalOpen(!isAuthModalOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <Router>
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

          {/* Маршрутизация */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About_Us />} />
          </Routes>
        </div>

        {/* Футер */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
