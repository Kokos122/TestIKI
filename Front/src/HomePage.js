import React from "react";

const HomePage = ({ darkMode }) => {
  const items = [
    { img: "/images/test1.png", title: "Кто ты из Смешариков?", large: true },
    { img: "/images/test2.png", title: "Тест на тревожность" },
    { img: "/images/test3.png", title: "Тест на влюбленность" },
    { img: "/images/test4.png", title: "Тест на проф.ориентацию" },
    { img: "/images/test5.png", title: "Тест на логику" },
  ];

  return (
    <div className="container mx-auto px-24 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className={`p-1 rounded-xl shadow-md w-full transition-colors duration-300 
            ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-950 text-white" 
                       : "bg-gradient-to-br from-teal-200 to-teal-500 text-black"}`}>
            <img 
              src={items[0].img} 
              alt={items[0].title} 
              className="h-96 w-full object-cover rounded-md" 
            />
            <p className="text-center mt-2 font-semibold">{items[0].title}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-1">
          {items.slice(1).map((item, index) => (
            <div key={index} className={`p-1 rounded-xl shadow-md transition-colors duration-300
              ${darkMode ? "bg-gradient-to-br from-slate-900 to-slate-950 text-white"
                         : "bg-gradient-to-br from-teal-400 to-teal-500 text-black"}`}>
              <img 
                src={item.img} 
                alt={item.title} 
                className="h-48 w-full object-cover rounded-md" 
              />
              <p className="text-center mt-2 font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
