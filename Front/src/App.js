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
  const [darkMode, setDarkMode] = useState(true); 

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleAuthModal = () => setIsAuthModalOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <Router>
      <div 
        className={`min-h-screen flex flex-col transition-colors duration-300 
        ${darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950" 
                   : "bg-gradient-to-br from-neutral-50 to-neutral-400"}`}
      >
        <Header 
          onSidebarToggle={toggleSidebar} 
          onProfileClick={toggleAuthModal} 
          onThemeToggle={toggleTheme}
          darkMode={darkMode} 
        />

        <div className="flex-grow">
          <AnimatePresence>
            {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} darkMode={darkMode} />}
          </AnimatePresence>

          <AnimatePresence>
            {isAuthModalOpen && <AuthModal onClose={toggleAuthModal} />}
          </AnimatePresence>

          <Routes>
            <Route path="/" element={<HomePage darkMode={darkMode} />} />
            <Route path="/about" element={<About_Us darkMode={darkMode} />} />
          </Routes>
        </div>

        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
};

export default App;
