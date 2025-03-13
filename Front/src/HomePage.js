import React from "react";
import { Link } from "react-router-dom";

const HomePage = ({ darkMode }) => {
  const items = [
    { img: "/images/test9.png", title: "Кто ты из Ходячих мертвецов?", link: "/walking-dead-test" },
    { img: "/images/test1.png", title: "Кто ты из Смешариков?", link: "/smeshariki-test" },
    { img: "/images/test2.png", title: "Тест на тревожность", link: "/anxiety-test" },
    { img: "/images/test3.png", title: "Тест на влюбленность", link: "/love-test" },
    { img: "/images/test4.png", title: "Тест на проф.ориентацию", link: "/career-test" },
    { img: "/images/test5.png", title: "Тест на логику", link: "/logic-test" },
    { img: "/images/test6.png", title: "Тест на креативность", link: "/creativity-test" },
    { img: "/images/test7.png", title: "Тест на знание флагов", link: "/flags-test" },
    { img: "/images/test8.png", title: "Кто ты из Дюны?", link: "/dune-test" },
    { img: "/images/test10.png", title: "Тест на память", link: "/memory-test" },
  ];

  return (
    <div className="container mx-auto px-auto md:px-12 relative">
      <div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[900px] rounded-xl transition-colors duration-300 z-1
        ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-900" : "bg-gradient-to-br from-indigo-300 to-indigo-500"}`}
        style={{ height: "calc(100%)" }}
      ></div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center mx-auto max-w-[900px] p-6 mt-10">
        {items.map((item, index) => (
          <Link key={index} to={item.link} className="w-full">
            <div
              className={`p-3 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer aspect-[4/3] w-full
              ${darkMode ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white"
                         : "bg-gradient-to-br from-indigo-100 to-indigo-200 text-black"}`}
            >
              <img src={item.img} alt={item.title} className="h-full w-full object-cover rounded-lg" />
              <p className="text-center mt-2 font-semibold">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
