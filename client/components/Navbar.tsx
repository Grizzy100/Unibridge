"use client";

import { useRouter } from "next/navigation";
import { FiStar } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa6";

export default function Navbar() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/University");
  };

  return (
    <nav className="fixed w-full bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-7 bg-[#736bff] rounded-xl flex items-center justify-center">
              <FaGraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="pl-1 text-sm font-bold text-gray-900">UniBridge</span>
          </div>

          {/* Links (desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-xs text-gray-600 hover:text-[#736bff] transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-xs text-gray-600 hover:text-[#736bff] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-xs text-gray-600 hover:text-[#736bff] transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-xs text-gray-600 hover:text-[#736bff] transition-colors"
            >
              About
            </a>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-xs text-gray-600 hover:text-[#736bff] transition-colors">
              About
            </button>

            <button
              onClick={handleLogin}
              className="text-sm bg-[#736bff] text-white px-4 py-2 rounded-lg hover:bg-[#5f57e6] transition-all hover:shadow-lg hover:shadow-[#736bff]/30"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
