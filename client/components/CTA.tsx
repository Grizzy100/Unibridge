"use client";

import React from "react";

const CTACard: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#e8e6ff] via-[#f5f4ff] to-white">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-br from-[#2d1b69] via-[#4a2f8f] to-[#5b3aa0] rounded-3xl overflow-hidden shadow-2xl p-12 md:p-16">
          {/* Decorative 3D Shapes */}
          <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#736bff] to-[#9b8fff] transform rotate-45 rounded-2xl"></div>
              <div className="absolute inset-2 bg-gradient-to-tl from-[#5b4acc] to-[#8676ff] transform rotate-45 rounded-2xl"></div>
            </div>
          </div>

          <div className="absolute bottom-10 left-20 w-24 h-24 opacity-15">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#736bff] to-[#a599ff] transform -rotate-12 rounded-xl"></div>
              <div className="absolute inset-1 bg-gradient-to-tl from-[#6757dd] to-[#9b8fff] transform -rotate-12 rounded-xl"></div>
            </div>
          </div>

          <div className="absolute top-20 right-16 w-28 h-28 opacity-15">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9b8fff] to-[#736bff] rounded-full"></div>
              <div className="absolute inset-2 bg-gradient-to-tl from-[#8676ff] to-[#a599ff] rounded-full"></div>
            </div>
          </div>

          <div className="absolute bottom-16 right-10 w-36 h-36 opacity-20">
            <div className="relative w-full h-full transform rotate-12">
              <div className="absolute inset-0 bg-gradient-to-br from-[#736bff] to-[#5b4acc] clip-triangle"></div>
              <div className="absolute inset-3 bg-gradient-to-tl from-[#6757dd] to-[#8676ff] clip-triangle"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Transform Your Campus Experience
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Manage students, staff, and operations — all from one unified dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-[#c4ff61] text-gray-900 px-8 py-4 rounded-lg hover:bg-[#b8f054] transition-all hover:shadow-lg font-semibold text-lg">
                Get Started Free
              </button>
              <button className="text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all font-semibold text-lg border-2 border-white/20">
                Book a Demo
              </button>
            </div>
            <p className="text-white/60 text-sm mt-6">
              14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTACard;
