import React from "react";
import { FaUserCircle } from "react-icons/fa";

const HomePage = () => {
  const items = [
    { img: "/images/test1.png", title: "Кто ты из Смешариков?", large: true },
    { img: "/images/test2.png", title: "Тест на тревожность" },
    { img: "/images/test3.png", title: "Тест на влюбленность" },
    { img: "/images/test4.png", title: "Тест на проф.ориентацию" },
    { img: "/images/test5.png", title: "Тест на логику" },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow-md w-full">
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
            <div key={index} className="bg-white p-4 rounded-xl shadow-md">
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
