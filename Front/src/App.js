import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import HomePage from "./HomePage.js";
import Header from "./Header.js";
import Sidebar from "./Sidebar.js";
import AuthModal from "./AuthModal.js";
import Footer from "./Footer.js";
import About_Us from "./About_Us.js";
import ProfilePage from "./ProfilePage.js";
import TestsPage from './TestsPage.js';

// Импорт тестов
import AnxietyTest from "./components/AnxietyTest.js";
import LoveTest from "./components/LoveTest.js";
import CareerTest from "./components/CareerTest.js";
import LogicTest from "./components/LogicTest.js";
import CreativityTest from "./components/CreativityTest.js";
import FlagsTest from "./components/FlagsTest.js";
import DuneTest from "./components/DuneTest.js";
import MemoryTest from "./components/MemoryTest.js";
import WalkingDeadTest from "./components/WalkingDeadTest.js";
import SmesharikiTest from "./components/SmesharikiTest.js";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleAuthModal = () => setIsAuthModalOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 
        ${darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950" 
                   : "bg-gradient-to-br from-neutral-50 to-neutral-100"}`}>
        
        <Header 
          onSidebarToggle={toggleSidebar} 
          onProfileClick={toggleAuthModal} 
          onThemeToggle={toggleTheme}
          darkMode={darkMode} 
        />

        <div className="flex-grow">
          <AnimatePresence>
            {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} darkMode={darkMode} />}
            {isAuthModalOpen && <AuthModal onClose={toggleAuthModal} />}
          </AnimatePresence>

          <Routes>
            <Route path="/" element={<HomePage darkMode={darkMode} />} />
            <Route path="/about" element={<About_Us darkMode={darkMode} />} />
            <Route path="/profile" element={<ProfilePage darkMode={darkMode} />} />
            
            <Route path="/tests" element={
              <TestsPage 
                darkMode={darkMode}
                onSidebarToggle={toggleSidebar}
                onProfileClick={toggleAuthModal}
                onThemeToggle={toggleTheme}
              />
            } />

            {/* Маршруты тестов */}
            <Route path="/anxiety-test" element={<AnxietyTest darkMode={darkMode} />} />
            <Route path="/love-test" element={<LoveTest darkMode={darkMode} />} />
            <Route path="/career-test" element={<CareerTest darkMode={darkMode} />} />
            <Route path="/logic-test" element={<LogicTest darkMode={darkMode} />} />
            <Route path="/creativity-test" element={<CreativityTest darkMode={darkMode} />} />
            <Route path="/flags-test" element={<FlagsTest darkMode={darkMode} />} />
            <Route path="/dune-test" element={<DuneTest darkMode={darkMode} />} />
            <Route path="/memory-test" element={<MemoryTest darkMode={darkMode} />} />
            <Route path="/walking-dead-test" element={<WalkingDeadTest darkMode={darkMode} />} />
            <Route path="/smeshariki-test" element={<SmesharikiTest darkMode={darkMode} />} />
          </Routes>
        </div>

        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
};

export default App;