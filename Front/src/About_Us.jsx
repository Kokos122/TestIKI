import React from "react";

const About_Us = ({ darkMode }) => {
  return (
    <div className={`container mx-auto px-24 py-12 transition-colors duration-300 ${
        darkMode ? "text-white"
                 : "text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">О нас</h1>
      <p className="text-lg">
        Добро пожаловать! Мы команда, создающая интересные тесты для саморазвития и развлечения.
      </p>
      <p className="mt-2">
        Наши тесты разработаны с учетом научных исследований и пользовательского опыта.
      </p>
    </div>
  );
};

export default About_Us;
