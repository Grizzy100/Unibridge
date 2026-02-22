"use client";

import { FiArrowRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-10 px-6 overflow-hidden isolate">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">

        <img
          src="/2.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-[1.015]"
          style={{ objectPosition: "50% 85%" }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 via-white/50 to-white/10" />

        <div className="absolute inset-0 bg-[radial-gradient(55%_35%_at_50%_0%,rgba(115,107,255,0.14),transparent)]" />

        <div className="absolute top-[-160px] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#736bff]/20 blur-[120px] rounded-full pointer-events-none" />

      </div>


      {/* CONTENT */}
      <div className="relative max-w-3xl mx-auto text-center">

        


        {/* HEADLINE */}
        <h1 className="
          font-sans

          text-[34px]
          sm:text-[42px]
          md:text-[48px]

          font-semibold

          text-gray-900

          leading-[1.1]

          tracking-[-0.02em]
          mt-10
          mb-4
        ">

          Bridging Every Part of Campus

          <br />

          <span className="
            text-[#736bff]
            tracking-[-0.015em]
          ">
            Life Seamlessly
          </span>

        </h1>


        {/* DESCRIPTION */}
        <p className="
          font-sans

          text-[15px]

          text-gray-600

          leading-[1.6]

          tracking-[-0.005em]

          mb-7

          max-w-lg
          mx-auto
        ">
          UniBridge connects people, processes, and progress —
          enabling institutions to operate with clarity and efficiency.
        </p>


        {/* BUTTONS */}
        <div className="flex items-center justify-center gap-1 mb-9">

          {/* Primary */}
          <button className="
            font-sans

            text-[11px]
            font-medium

            tracking-[0.01em]

            bg-[#736bff]
            text-white

            px-2 py-1

            rounded-lg

            shadow-sm shadow-[#736bff]/25

            hover:shadow-md hover:shadow-[#736bff]/30

            transition-all duration-200

            flex items-center gap-2
          ">

            Get Started

            <FiArrowRight className="w-3 h-3" />

          </button>


          {/* Secondary */}
          <button className="
            font-sans

            text-[11px]
            font-medium

            tracking-[0.01em]

            px-2 py-1

            rounded-lg

            bg-white/80
            backdrop-blur-sm

            border border-gray-200

            hover:border-gray-300

            transition-all duration-200
          ">
            Explore
          </button>

        </div>


        {/* DASHBOARD PREVIEW */}
        <div className="relative max-w-3xl mx-auto">

          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />

          <div className="
            relative

            rounded-xl

            overflow-hidden

            border border-gray-200/60

            shadow-[0_12px_40px_rgba(0,0,0,0.08)]

            bg-white
          ">

            <img
              src="/HeroPic.png"
              alt="Dashboard preview"
              className="w-full h-auto"
            />

          </div>

        </div>

      </div>

    </section>
  );
}