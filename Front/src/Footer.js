import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = ({ darkMode }) => {
  const footerBg = darkMode
    ? "bg-gradient-to-br from-slate-700 to-slate-950 text-white"
    : "bg-gradient-to-br from-teal-200 to-teal-500 text-black text-opacity-80";

  return (
    <footer className={`py-6 mt-8 transition-colors duration-300 ${footerBg}`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        
        {/* Логотип и текст */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-semibold">TestIKI</h2>
          <p className="text-sm">© {new Date().getFullYear()} Все права защищены.</p>
        </div>

        {/* Социальные сети */}
        <div className="flex space-x-6">
          <a href="#" aria-label="Facebook" className="hover:text-gray-400 transition duration-300">
            <FaFacebook size={30} />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-gray-400 transition duration-300">
            <FaTwitter size={30} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-gray-400 transition duration-300">
            <FaInstagram size={30} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
