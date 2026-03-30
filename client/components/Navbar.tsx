"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa6";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push("/University");
  };

  const navTextClass = `
    font-sans
    text-[10px]
    font-medium
    uppercase
    tracking-[0.11em]
    text-gray-600
    hover:text-[#736bff]
    transition-colors
    duration-300
  `;

  return (
    <nav className="fixed w-full bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#736bff] rounded-md sm:rounded-xl flex items-center justify-center">
              <FaGraduationCap className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
            </div>

            <span className="
              font-sans
              text-[14px] sm:text-[19px]
              font-bold
              uppercase
              tracking-[0.01]
              text-gray-900/70
            ">
              UniBridge
            </span>
          </div>


          {/* Links */}
          <div className="hidden md:flex items-center gap-10 " >

            <a href="#features" className={navTextClass}>
              Features
            </a>

            <a href="#how-it-works" className={navTextClass}>
              How It Works
            </a>

            <a href="#pricing" className={navTextClass}>
              Pricing
            </a>

            <a href="#about" className={navTextClass}>
              About
            </a>

          </div>


          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">

            <button
              onClick={handleLogin}
              className="
                font-sans
                text-[9px] sm:text-[12px]
                font-medium
                uppercase
                tracking-[0.1em] sm:tracking-[0.18em]
                bg-[#736bff]
                text-white
                px-3 sm:px-5 py-1.5 sm:py-2
                rounded-md sm:rounded-lg
                hover:bg-[#5f57e6]
                transition-all
                duration-300
              "
            >
              Login
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 gap-6 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className={`${navTextClass} text-sm`}>
          Features
        </a>
        <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className={`${navTextClass} text-sm`}>
          How It Works
        </a>
        <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className={`${navTextClass} text-sm`}>
          Pricing
        </a>
        <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className={`${navTextClass} text-sm`}>
          About
        </a>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}