import React from "react";
import { motion } from "framer-motion";

const Footer = ({ darkMode }) => {
  const footerBg = darkMode 
    ? "bg-gradient-to-t from-gray-900 to-gray-800"
    : "bg-gradient-to-t from-indigo-600 to-indigo-500";

  const textColor = darkMode ? "text-indigo-200" : "text-white";

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
        className={`${footerBg} ${textColor} py-12 px-4`}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Цитата о тестах */}
          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <blockquote className="text-xl italic font-medium">
              "Тесты — это не экзамен, а возможность узнать себя лучше. Каждый вопрос — шаг к самопознанию."
            </blockquote>
          </motion.div>

          {/* Копирайт */}
          <motion.div 
            variants={itemVariants}
            className={`border-t ${darkMode ? 'border-gray-700' : 'border-indigo-400'} pt-4 text-sm opacity-70`}
          >
            © {new Date().getFullYear()} TestIKI — Все права защищены
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;