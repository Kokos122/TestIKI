import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaBars, FaGoogle } from "react-icons/fa";
import { SlSocialVkontakte } from "react-icons/sl";

const Header = ({ onProfileClick, onMenuToggle }) => {
  return (
    <header className="bg-teal-500 p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <FaBars className="text-2xl text-white cursor-pointer mr-4" onClick={onMenuToggle} />
        <h1 className="text-white text-4xl font-bold">TestIKI</h1>
      </div>
      <nav className="flex gap-8 text-white text-lg font-semibold">
        <a href="#">О нас</a>
        <a href="#">Поддержка</a>
        <a href="#">Контакты</a>
        <a href="#">Правила</a>
      </nav>
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск..."
          className="px-4 py-2 rounded-md w-96 shadow-inner focus:outline-none"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-600 cursor-pointer" />
      </div>
      <FaUserCircle className="text-5xl text-white cursor-pointer" onClick={onProfileClick} />
    </header>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={`fixed left-0 top-0 h-full w-72 bg-gray-800 text-white p-6 shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform`}>
      <button className="text-white mb-4" onClick={onClose}>Закрыть</button>
      <h2 className="text-xl font-bold mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>Тесты</h2>
      {expanded && (
        <ul className="mb-4">
          <li className="mb-2"><a href="#">Личность и характер</a></li>
          <li className="mb-2"><a href="#">Темперамент</a></li>
          <li className="mb-2"><a href="#">Межличностные отношения</a></li>
          <li className="mb-2"><a href="#">Диагностика отклонений</a></li>
          <li className="mb-2"><a href="#">Депрессия и стресс</a></li>
        </ul>
      )}
      <h2 className="text-xl font-bold mb-4">Дополнительно</h2>
      <ul>
        <li className="mb-2"><a href="#">Блог</a></li>
        <li className="mb-2"><a href="#">Психологические термины</a></li>
        <li className="mb-2"><a href="#">О проекте</a></li>
        <li className="mb-2"><a href="#">Контакты</a></li>
      </ul>
    </div>
  );
};


const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center">
        <h2 className="text-3xl font-bold mb-6">{isRegister ? "Регистрация" : "Вход"}</h2>
        <input type="text" placeholder={isRegister ? "Логин" : "Логин или Email"} className="w-full p-3 mb-3 border rounded-lg" />
        {isRegister && <input type="email" placeholder="Email" className="w-full p-3 mb-3 border rounded-lg" />}
        <input type="password" placeholder="Пароль" className="w-full p-3 mb-3 border rounded-lg" />
        {isRegister && <input type="password" placeholder="Повторите пароль" className="w-full p-3 mb-5 border rounded-lg" />}
        <button className="bg-teal-500 text-white w-full py-3 rounded-lg mb-3">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
        <div className="flex justify-center gap-6 mb-4">
          <FaGoogle className="text-red-500 text-3xl cursor-pointer" />
          <SlSocialVkontakte className="text-blue-600 text-4xl cursor-pointer" />
          <a href="https://www.gosuslugi.ru" target="_blank" rel="noopener noreferrer">
            <img src="/gosuslugi-logo.png" alt="Госуслуги" className="h-9 cursor-pointer" />
          </a>
        </div>
        <p className="text-blue-500 text-sm cursor-pointer" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </p>
        <button className="mt-4 text-red-500 w-full text-lg" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

const TestFeed = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Популярные тесты</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">Тест 1</div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">Тест 2</div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">Тест 3</div>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Новые тесты</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">Тест 4</div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">Тест 5</div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">Тест 6</div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <Header onProfileClick={() => setAuthOpen(true)} onMenuToggle={() => setMenuOpen(!isMenuOpen)} />
      <Sidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
      {isAuthOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <TestFeed />
    </div>
  );
};

export default App;
