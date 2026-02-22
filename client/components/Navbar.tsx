"use client";

import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa6";

export default function Navbar() {
  const router = useRouter();

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
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#736bff] rounded-xl flex items-center justify-center">
              <FaGraduationCap className="w-5 h-5 text-white" />
            </div>

            <span className="
              font-sans
              text-[19px]
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
          <div className="flex items-center gap-8">

            {/* Placeholder for toggle button */}
            <button
              onClick={handleLogin}
              className="
                font-sans
                text-[12px]
                font-medium
                uppercase
                tracking-[0.18em]

                bg-[#736bff]
                text-white

                px-5 py-2
                rounded-lg

                hover:bg-[#5f57e6]

                transition-all
                duration-300
              "
            >
              Login
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
}