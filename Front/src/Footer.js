import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Логотип и текст */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-semibold">TestIKI</h2>
          <p className="text-sm">© {new Date().getFullYear()} Все права защищены.</p>
        </div>

        {/* Социальные сети */}
        <div className="flex space-x-8">
          <a href="#" className="hover:text-white transition">
            <FaFacebook size={30} />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaTwitter size={30} />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaInstagram size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
