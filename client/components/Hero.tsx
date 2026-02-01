"use client";

import { FiArrowRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 px-6 overflow-hidden isolate">
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0">
        {/* Image (visible) */}
        <img
  src="/2.png"
  alt=""
  aria-hidden="true"
  className="bg-[url(/login background.png)] bg-no-repeat bg-cover"
  // className="absolute inset-0 h-full w-full object-cover scale-[0.95]"
  style={{ objectPosition: "50% 100%" }} // keep bottom visible
/>

        {/* Radial Gradient Background from Top (your snippet, updated to #736bff) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #fff 40%, #736bff 100%)",
            opacity: 0.85, // increase = more gradient visible
          }}
        />

        {/* This replaces the heavy white overlay (lets image show) */}
        <div className="absolute inset-0 bg-white/45" />

        {/* Slight top tint so it feels intentional (still minimal) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#736bff]/12 via-transparent to-transparent" />

        {/* Accent glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#736bff]/22 blur-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-[#736bff]/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
          <span className="bg-[#736bff] text-white text-xs font-semibold px-2 py-1 rounded-full">
            NEW
          </span>
          <span className="text-[#736bff] text-sm font-medium">
            Streamline Campus Life with UniBridge
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Bridging Every Part of Campus <br className="hidden sm:block" />
          <span className="text-5xl text-[#736bff]">Life Seamlessly</span>
        </h1>

        <p className="text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
          UniBridge connects people, processes, and progress — empowering
          institutions to work smarter and grow together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-14">
          <button className="text-sm bg-[#736bff] text-white px-3 py-2 rounded-lg hover:bg-[#5f57e6] transition-all hover:shadow-xl hover:shadow-[#736bff]/30 flex items-center space-x-2 group">
            <span className="font-semibold">Get Started Free</span>
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="text-sm border-2 border-gray-200 bg-white/70 text-gray-900 px-3 py-2 rounded-lg hover:border-[#736bff] hover:text-[#736bff] transition-all backdrop-blur-sm">
            Explore Dashboard
          </button>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-0 pointer-events-none" />
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <img
              src="/HeroPic.png"
              alt="UniBridge Dashboard Preview"
              className="w-full h-auto scale-90 md:scale-95 mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
