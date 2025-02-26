import React from "react";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-teal-500 p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <FaBars className="text-2xl text-black cursor-pointer mr-4" />
        <h1 className="text-black text-2xl font-bold">TestIKI</h1>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск..."
          className="px-4 py-2 rounded-md w-64 shadow-inner focus:outline-none"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-600 cursor-pointer" />
      </div>
      <FaUserCircle className="text-3xl text-black cursor-pointer" />
    </header>
  );
};

const Card = ({ text }) => {
  return (
    <div className="bg-teal-400 text-white font-bold p-6 rounded-lg shadow-md text-center">
      {text}
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="bg-teal-100 min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card text="О нас..." />
        <Card text="Лучший тест" />
        <Card text="Второй лучший тест" />
      </div>
      <h2 className="text-black text-xl font-bold mt-6">Тесты Онлайн</h2>
      <div className="inline-block bg-teal-400 text-white py-1 px-3 rounded-md text-sm mt-2">Категория</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card text="ТЕСТ1" />
        <Card text="ТЕСТ2" />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Header />
      <MainContent />
    </div>
  );
};

export default App;
