import React from "react";

const ProfilePage = ({ darkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 md:px-12 pt-24 pb-6 transition-colors duration-300
      ${darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950 text-white" : "bg-gradient-to-br from-neutral-50 to-neutral-100 text-black"}`}>
      
      {/* Заголовок */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Мой профиль</h1>

      {/* Карточка профиля */}
      <div className={`p-6 rounded-xl shadow-lg w-full max-w-md text-center 
        ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <img 
          src="/images/avatar.png" 
          alt="Аватар" 
          className="w-24 h-24 mx-auto rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold">Имя пользователя</h2>
        <p className="text-gray-500">{darkMode ? "Тёмная тема включена" : "Светлая тема включена"}</p>
        
        {/* Кнопки */}
        <div className="mt-4">
          <button className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition">
            Редактировать профиль
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
