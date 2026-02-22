// "use client";

// import { FaChartLine, FaShieldAlt, FaRobot, FaGem, FaBolt, FaRocket, FaChartBar } from "react-icons/fa";

// interface FeaturePill {
//   text: string;
//   icon: JSX.Element;
//   className: string;
//   delay: string;
// }

// export default function WhyUs() {
//   const features: FeaturePill[] = [
//     {
//       text: "Boost Productivity",
//       icon: <FaChartLine className="text-[#736bff]" />,
//       className: "top-[120px] left-[80px]",
//       delay: "0s",
//     },
//     {
//       text: "Automate Securely",
//       icon: <FaShieldAlt className="text-[#736bff]" />,
//       className: "top-[40px] left-1/2 -translate-x-1/2",
//       delay: "0.5s",
//     },
//     {
//       text: "AI Workflow",
//       icon: <FaRobot className="text-[#736bff]" />,
//       className: "top-[120px] right-[80px]",
//       delay: "1s",
//     },
//     {
//       text: "Value from Data",
//       icon: <FaGem className="text-[#736bff]" />,
//       className: "top-1/2 -translate-y-1/2 right-[20px]",
//       delay: "1.5s",
//     },
//     {
//       text: "Improve Efficiency",
//       icon: <FaBolt className="text-[#736bff]" />,
//       className: "bottom-[120px] right-[80px]",
//       delay: "2s",
//     },
//     {
//       text: "Deploy Intelligent Workflows",
//       icon: <FaRocket className="text-[#736bff]" />,
//       className: "bottom-[40px] left-1/2 -translate-x-1/2",
//       delay: "2.5s",
//     },
//     {
//       text: "Scale Operations",
//       icon: <FaChartBar className="text-[#736bff]" />,
//       className: "bottom-[120px] left-[80px]",
//       delay: "3s",
//     },
//   ];

//   return (
//     <section className="py-24 px-6 bg-gradient-to-br from-[#0a0a1f] via-[#151535] to-[#1a1a3f] relative overflow-hidden">
//       {/* Background glow */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 left-10 w-96 h-96 bg-[#736bff] rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#736bff] rounded-full blur-3xl"></div>
//       </div>

//       <div className="max-w-6xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             <span className="text-white">Unibridge </span>
//           </h2>
//           <p className="text-white/70 text-lg max-w-4xl mx-auto leading-relaxed">
//             Why us? Because students shouldn’t have to chase updates.
// We bring tasks, messages, attendance insights, and requests into one clear flow—so nothing gets missed and everything stays on time.
//           </p>
//         </div>

//         {/* SVG Diagram */}
//         <div className="relative max-w-4xl mx-auto">
//           <svg
//             className="absolute inset-0 w-full h-full"
//             viewBox="0 0 800 600"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             {/* Concentric arcs */}
//             {[50, 90, 130, 170, 210].map((y, i) => (
//               <path
//                 key={i}
//                 d={`M ${100 + i * 20} ${300 + i * 20} Q 400 ${y}, ${700 - i * 20} ${300 + i * 20}`}
//                 stroke="url(#gradient1)"
//                 strokeWidth="2"
//                 fill="none"
//                 opacity={0.45 - i * 0.05}
//               />
//             ))}

//             <defs>
//               <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="#736bff" stopOpacity="0.6" />
//                 <stop offset="50%" stopColor="#736bff" stopOpacity="0.3" />
//                 <stop offset="100%" stopColor="#736bff" stopOpacity="0.6" />
//               </linearGradient>
//             </defs>
//           </svg>

//           {/* Floating Pills */}
//           <div className="relative h-[600px]">
//             {features.map((feature, i) => (
//               <div
//                 key={i}
//                 className={`absolute animate-float ${feature.className}`}
//                 style={{ animationDelay: feature.delay }}
//               >
//                 <div className="bg-gradient-to-r from-[#1a1a3f] to-[#252550] border border-[#736bff]/30 rounded-full px-6 py-3 flex items-center space-x-2 backdrop-blur-sm hover:border-[#736bff]/60 transition-all">
//                   <span className="text-white/90 text-sm font-medium">{feature.text}</span>
//                   {feature.icon}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChartLine,
  FaEnvelopeOpenText,
  FaTasks,
  FaBell,
  FaUserShield,
  FaUserFriends,
  FaBolt,
} from "react-icons/fa";

type PillKey =
  | "notifications"
  | "attendance"
  | "tasks"
  | "mail"
  | "warden"
  | "parent"
  | "flow";

interface FeaturePill {
  key: PillKey;
  text: string;
  icon: JSX.Element;
  className: string;
  delay: string;
  variant?: "primary" | "default";
  duration?: string;
  drift?: number;
  anchor: { top: number; left: number };
}

type Line = {
  key: PillKey;
  x1: number;
  y1: number;
  vx: number;
  vy: number;
  x2: number;
  y2: number;
};

export default function WhyUs() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pillRefs = useRef<Record<PillKey, HTMLDivElement | null>>({
    notifications: null,
    attendance: null,
    tasks: null,
    mail: null,
    warden: null,
    parent: null,
    flow: null,
  });

  const features: FeaturePill[] = useMemo(
    () => [
      {
        key: "notifications",
        text: "Smart Notifications",
        icon: <FaBell className="text-[#736bff]" />,
        className: "top-[86px] left-1/2 -translate-x-1/2",
        delay: "0.1s",
        variant: "primary",
        duration: "4.6s",
        drift: 2,
        anchor: { top: 268, left: 500 },
      },
      {
        key: "attendance",
        text: "Attendance Insights",
        icon: <FaChartLine className="text-[#736bff]" />,
        className: "top-[160px] left-[88px]",
        delay: "0.2s",
        duration: "5.2s",
        drift: 1,
        anchor: { top: 398, left: 325 },
      },
      {
        key: "tasks",
        text: "Task Stacking",
        icon: <FaTasks className="text-[#736bff]" />,
        className: "top-[160px] right-[88px]",
        delay: "0.35s",
        duration: "4.9s",
        drift: 1,
        anchor: { top: 398, left: 675 },
      },
      {
        key: "mail",
        text: "Mail Regulation",
        icon: <FaEnvelopeOpenText className="text-[#736bff]" />,
        className: "top-1/2 -translate-y-1/2 right-[44px]",
        delay: "0.55s",
        duration: "5.6s",
        drift: 2,
        anchor: { top: 462, left: 725 },
      },
      {
        key: "warden",
        text: "Warden Automation",
        icon: <FaUserShield className="text-[#736bff]" />,
        className: "bottom-[168px] right-[92px]",
        delay: "0.75s",
        duration: "5.1s",
        drift: 1,
        anchor: { top: 520, left: 660 },
      },
      {
        key: "parent",
        text: "Parent Automation",
        icon: <FaUserFriends className="text-[#736bff]" />,
        className: "bottom-[96px] left-1/2 -translate-x-1/2",
        delay: "0.95s",
        duration: "4.8s",
        drift: 2,
        anchor: { top: 546, left: 500 },
      },
      {
        key: "flow",
        text: "Faster Daily Flow",
        icon: <FaBolt className="text-[#736bff]" />,
        className: "bottom-[168px] left-[92px]",
        delay: "1.15s",
        duration: "5.4s",
        drift: 1,
        anchor: { top: 520, left: 340 },
      },
    ],
    []
  );

  const [lines, setLines] = useState<Line[]>([]);

  const makeVertex = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const bendOut = 95;
    const elbowLift = 30;

    if (Math.abs(dx) < 35) {
      return { vx: x1, vy: y1 - 85 };
    }

    const outward = dx > 0 ? bendOut : -bendOut;
    const vx = x1 + outward;
    const vy = y1 + dy * 0.45 - elbowLift;

    return { vx, vy };
  };

  const computeLines = () => {
    const container = containerRef.current;
    if (!container) return;

    const crect = container.getBoundingClientRect();
    const cw = crect.width;
    const ch = crect.height;

    const toSvgX = (px: number) => (px / cw) * 1000;
    const toSvgY = (px: number) => (px / ch) * 600;

    const next: Line[] = features.map((f) => {
      const pillEl = pillRefs.current[f.key];
      const prect = pillEl?.getBoundingClientRect();

      const x1 = f.anchor.left;
      const y1 = f.anchor.top;

      let x2 = x1;
      let y2 = y1;

      if (prect) {
        const pillCenterX = prect.left + prect.width / 2 - crect.left;
        const pillCenterY = prect.top + prect.height / 2 - crect.top;
        x2 = toSvgX(pillCenterX);
        y2 = toSvgY(pillCenterY);
      }

      const { vx, vy } = makeVertex(x1, y1, x2, y2);
      return { key: f.key, x1, y1, vx, vy, x2, y2 };
    });

    setLines(next);
  };

  useEffect(() => {
    computeLines();

    let raf = 0;
    const loop = () => {
      computeLines();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const onResize = () => computeLines();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [features]);

  return (
    <section className="relative overflow-hidden py-24 px-6 bg-gradient-to-br from-[#070714] via-[#0b0b1f] to-[#070714]">

      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(115,107,255,0.10)_0%,rgba(0,0,0,0)_60%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

          <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] text-white">
            Why <span className="text-[#736bff]">UniBridge</span>
          </h2>

          <p className="mt-5 text-[15px] md:text-[16px] leading-[1.65] text-white/60">
            UniBridge turns campus operations into a single, reliable system —
            enabling faster execution, structured communication, and full
            operational clarity across the institution.
          </p>

        </div>

        {/* Graph Container */}
        <div className="relative mx-auto max-w-5xl">

          <div ref={containerRef} className="relative h-[560px] md:h-[600px]">

            {/* center glow */}
            <div className="absolute left-1/2 top-[340px] w-[520px] h-[260px] -translate-x-1/2 bg-[#736bff]/10 blur-[120px]" />

            {/* SVG lines */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1000 600"
            >

              <defs>

                <linearGradient id="lineGrad" x1="0" y1="0" x2="1000" y2="600">
                  <stop offset="0%" stopColor="#736bff" stopOpacity="0.18"/>
                  <stop offset="50%" stopColor="#736bff" stopOpacity="0.55"/>
                  <stop offset="100%" stopColor="#736bff" stopOpacity="0.18"/>
                </linearGradient>

              </defs>

              {lines.map((l) => (
                <polyline
                  key={l.key}
                  points={`${l.x1},${l.y1} ${l.vx},${l.vy} ${l.x2},${l.y2}`}
                  stroke="url(#lineGrad)"
                  strokeWidth="1.2"
                  fill="none"
                />
              ))}

            </svg>

            {/* Pills */}
            {features.map((feature) => (

              <div
                key={feature.key}
                className={`absolute animate-float ${feature.className}`}
                style={{
                  animationDelay: feature.delay,
                  ["--dur" as any]: feature.duration,
                  ["--drift" as any]: `${feature.drift}px`,
                }}
              >

                <div
  ref={(el) => pillRefs.current[feature.key] = el}
  className="inline-flex items-center gap-3 px-6 py-3 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.45)] text-[13.5px] tracking-[-0.01em] text-white/85"
>

                  {feature.icon}
                  {feature.text}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      <style jsx>{`
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: floaty var(--dur, 5s) ease-in-out infinite;
        }
      `}</style>

    </section>
  );
}
