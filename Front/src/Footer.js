import React from "react";
import { FaStar, FaQuestionCircle, FaGithub, FaTelegram, FaVk } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = ({ darkMode }) => {
  const footerBg = darkMode 
    ? "bg-gradient-to-t from-gray-900 to-gray-800"
    : "bg-gradient-to-t from-indigo-600 to-indigo-500";

  const textColor = darkMode ? "text-indigo-200" : "text-white";
  const hoverColor = darkMode ? "hover:text-indigo-100" : "hover:text-gray-100";
  const socialBg = darkMode ? "bg-gray-800" : "bg-indigo-700";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const WaveDivider = () => (
    <div className="relative h-8 w-full overflow-hidden">
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="absolute top-0 left-0 w-full h-full"
      >
        <path 
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          fill={darkMode ? "#111827" : "#4f46e5"} 
          opacity=".25" 
        />
        <path 
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
          fill={darkMode ? "#111827" : "#4f46e5"} 
          opacity=".5" 
        />
        <path 
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
          fill={darkMode ? "#111827" : "#4f46e5"} 
        />
      </svg>
    </div>
  );

  return (
    <>
      <WaveDivider />
      
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className={`${footerBg} ${textColor} py-8 px-4`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Лого и описание */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="flex items-center mb-3">
                <img 
                  src={darkMode ? "/images/logo-white.png" : "/images/logo-white.png"} 
                  alt="TestIKI" 
                  className="h-10 w-auto mr-2"
                />
                <span className="text-lg font-medium"></span>
              </div>
              <p className="text-xs opacity-80 mb-3">
                Платформа для создания и прохождения тестов
              </p>
              
              {/* Социальные сети */}
              <div className="flex space-x-3 mt-2">
                {[
                  { icon: <FaGithub />, name: "GitHub" },
                  { icon: <FaTelegram />, name: "Telegram" },
                  { icon: <FaVk />, name: "VK" }
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    aria-label={social.name}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full ${socialBg} ${hoverColor} transition-all`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Основные разделы */}
            <motion.div variants={itemVariants}>
              <h3 className="text-md font-medium mb-3 flex items-center">
                <FaStar className="mr-2" /> Тесты
              </h3>
              <ul className="space-y-2">
                {["Программирование", "Психология", "Языки", "Все тесты"].map((item) => (
                  <motion.li 
                    key={item}
                    whileHover={{ x: 3 }}
                    className={`text-xs ${hoverColor} cursor-pointer`}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Поддержка */}
            <motion.div variants={itemVariants}>
              <h3 className="text-md font-medium mb-3 flex items-center">
                <FaQuestionCircle className="mr-2" /> Поддержка
              </h3>
              <ul className="space-y-2">
                {["FAQ", "Контакты", "Помощь"].map((item) => (
                  <motion.li 
                    key={item}
                    whileHover={{ x: 3 }}
                    className={`text-xs ${hoverColor} cursor-pointer`}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Копирайт */}
          <motion.div 
            variants={itemVariants}
            className={`border-t ${darkMode ? 'border-gray-700' : 'border-indigo-400'} mt-6 pt-4 text-xs text-center opacity-70`}
          >
            © {new Date().getFullYear()} TestIKI
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;