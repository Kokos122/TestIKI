import React from "react";

const HomePage = ({ darkMode }) => {
  const items = [
    { img: "/images/test9.png", title: "Кто ты из Ходячих мертвецов?" },
    { img: "/images/test1.png", title: "Кто ты из Смешариков?" },
    { img: "/images/test2.png", title: "Тест на тревожность" },
    { img: "/images/test3.png", title: "Тест на влюбленность" },
    { img: "/images/test4.png", title: "Тест на проф.ориентацию" },
    { img: "/images/test5.png", title: "Тест на логику" },
    { img: "/images/test6.png", title: "Тест на креативность" },
    { img: "/images/test7.png", title: "Тест на знание флагов" },
    { img: "/images/test8.png", title: "Кто ты из Дюны?" },
    { img: "/images/test10.png", title: "Тест на память" },
  ];

  return (
    <div className="container mx-auto px-auto md:px-12 relative">
      {/* Фон-прямоугольник */}
      <div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[900px] rounded-xl transition-colors duration-300 z-1
        ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-900" : "bg-gradient-to-br from-indigo-300 to-indigo-500"}`}
        style={{ height: "calc(100%)" }} // Равномерный отступ сверху
      ></div>

      {/* Контент с тестами */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center mx-auto max-w-[900px] p-6 mt-10">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl shadow-md transition-colors duration-300 aspect-[4/3] w-full
            ${darkMode ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white"
                       : "bg-gradient-to-br from-indigo-100 to-indigo-200 text-black"}`}
          >
            <img src={item.img} alt={item.title} className="h-full w-full object-cover rounded-lg" />
            <p className="text-center mt-2 font-semibold">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
