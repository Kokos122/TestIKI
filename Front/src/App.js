import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from 'axios';

import HomePage from "./HomePage.js";
import Header from "./Header.js";
import Sidebar from "./Sidebar.js";
import AuthModal from "./AuthModal.js";
import Footer from "./Footer.js";
import About_Us from "./About_Us.js";
import ProfilePage from "./ProfilePage.js";
import TestsPage from './TestsPage.js';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Создаем экземпляр axios с интерцептором
  const api = axios.create({
    baseURL: 'http://localhost:8080'
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      return Promise.reject(error);
    }
  );

  // Функция проверки аутентификации
  const verifyAuth = async (token) => {
    try {
      const response = await api.get('/me', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsAuthenticated(true);
      setCurrentUser(response.data.user);
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await verifyAuth(token);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleAuthModal = () => setIsAuthModalOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          darkMode ? "border-indigo-400" : "border-indigo-600"
        }`}></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300
        ${darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950"
                  : "bg-gradient-to-br from-neutral-50 to-neutral-100"}`}>
        
        <Header
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onSidebarToggle={toggleSidebar}
          onProfileClick={toggleAuthModal}
          onLogout={handleLogout}
          onThemeToggle={toggleTheme}
          darkMode={darkMode}
        />

        <div className="flex-grow">
          <AnimatePresence>
            {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} darkMode={darkMode} />}
            {isAuthModalOpen && (
              <AuthModal
                onClose={toggleAuthModal}
                onLoginSuccess={handleLogin}
              />
            )}
          </AnimatePresence>

          <Routes>
            <Route path="/" element={<HomePage darkMode={darkMode} />} />
            <Route path="/about" element={<About_Us darkMode={darkMode} />} />
            <Route
              path="/profile"
              element={
                isAuthenticated ?
                  <ProfilePage user={currentUser} darkMode={darkMode} /> :
                  <Navigate to="/" />
              }
            />
            <Route path="/tests" element={
              <TestsPage
                darkMode={darkMode}
                onSidebarToggle={toggleSidebar}
                onProfileClick={toggleAuthModal}
                onThemeToggle={toggleTheme}
              />
            } />
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