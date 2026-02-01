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

  // Elbow controls:
  // bendOut -> how wide the elbow is
  // elbowLift -> how high the elbow lifts
  const makeVertex = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const bendOut = 95; // elbow width
    const elbowLift = 30; // elbow lift

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  return (
    <section className="relative overflow-hidden py-24 px-6 bg-gradient-to-br from-[#070714] via-[#0d0d25] to-[#0b0b1a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(115,107,255,0.14)_0%,rgba(0,0,0,0)_52%,rgba(0,0,0,0.74)_100%)]" />

      <div className="pointer-events-none absolute -top-28 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#736bff] opacity-[0.10] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 right-[-160px] h-[560px] w-[560px] rounded-full bg-[#736bff] opacity-[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 left-[-170px] h-[560px] w-[560px] rounded-full bg-[#736bff] opacity-[0.06] blur-3xl" />

      {/* Orbs: a bit noticeable + back-and-forth (horizontal drift) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.33]">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="orb orb-4" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Why <span className="text-[#9ab7ff]">Unibridge</span>
          </h2>
          <p className="mt-5 text-xs md:text-lg leading-relaxed text-white/70">
            Unibridge turns campus operations into a single, reliable flow—so{" "}
            <span className="text-white/85">students stay informed</span>,{" "}
            <span className="text-white/85">teachers act faster</span>,{" "}
            <span className="text-white/85">wardens approve smoothly</span>, and{" "}
            <span className="text-white/85">parents stay updated</span>.
            <span className="text-white/85"> No missed tasks. No buried messages.</span>
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div ref={containerRef} className="relative h-[560px] md:h-[600px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(115,107,255,0.12)_0%,rgba(115,107,255,0.05)_30%,rgba(0,0,0,0)_62%)]" />

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 1000 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="arcGrad" x1="0" y1="0" x2="1000" y2="600" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#736bff" stopOpacity="0.42" />
                  <stop offset="50%" stopColor="#736bff" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#736bff" stopOpacity="0.34" />
                </linearGradient>

                {/* line color control: adjust these stopOpacity values to make wires brighter/dimmer */}
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1000" y2="600" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#736bff" stopOpacity="0.08" />
                  <stop offset="45%" stopColor="#736bff" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#736bff" stopOpacity="0.14" />
                </linearGradient>

                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path d="M 190 480 Q 500 140 810 480" stroke="url(#arcGrad)" strokeWidth="1.4" opacity="0.68" />
              <path d="M 245 512 Q 500 220 755 512" stroke="url(#arcGrad)" strokeWidth="1.25" opacity="0.52" />
              <path d="M 300 545 Q 500 300 700 545" stroke="url(#arcGrad)" strokeWidth="1.15" opacity="0.38" />

              {lines.map((l) => (
                <g key={l.key}>
                  <polyline
                    points={`${l.x1},${l.y1} ${l.vx},${l.vy} ${l.x2},${l.y2}`}
                    stroke="url(#lineGrad)"
                    strokeWidth="1.2"
                    opacity="0.95"
                    fill="none"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <g filter="url(#softGlow)">
                    <circle cx={l.x1} cy={l.y1} r="3.8" fill="#736bff" fillOpacity="0.88" />
                    <circle cx={l.x1} cy={l.y1} r="12" fill="#736bff" fillOpacity="0.12" />
                  </g>
                </g>
              ))}
            </svg>

            <div className="relative h-full w-full">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className={`absolute animate-float ${feature.className}`}
                  style={
                    {
                      animationDelay: feature.delay,
                      ["--dur" as any]: feature.duration ?? "5.1s",
                      ["--drift" as any]: `${feature.drift ?? 1}px`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    ref={(el) => {
                      pillRefs.current[feature.key] = el;
                    }}
                    className={[
                      "inline-flex items-center gap-3 rounded-full",
                      feature.variant === "primary" ? "px-7 py-3.5" : "px-6 py-3",
                      "bg-white/[0.06] backdrop-blur-xl",
                      "ring-1 ring-white/10",
                      "shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]",
                      "transition-all hover:bg-white/[0.085] hover:ring-white/15",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "whitespace-nowrap font-medium",
                        feature.variant === "primary"
                          ? "text-sm md:text-[15px] text-white/92"
                          : "text-sm text-white/88",
                      ].join(" ")}
                    >
                      {feature.text}
                    </span>

                    <span className="opacity-95">{feature.icon}</span>

                    <span className="ml-1 h-2 w-2 rounded-full bg-[#736bff]/85 shadow-[0_0_0_6px_rgba(115,107,255,0.12)]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-[92%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(115,107,255,0.16)_0%,rgba(0,0,0,0)_65%)] blur-2xl" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floaty {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(var(--drift, 1px), -8px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-float {
          animation: floaty var(--dur, 5.1s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }

        .orb {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(115, 107, 255, 0.26),
            rgba(115, 107, 255, 0.10) 42%,
            rgba(115, 107, 255, 0) 72%
          );
          filter: blur(16px);
          opacity: 0.75;
          animation: orbSide 12s ease-in-out infinite;
        }

        .orb-1 {
          top: 10%;
          left: 8%;
          animation-duration: 14s;
        }
        .orb-2 {
          top: 16%;
          right: 7%;
          width: 300px;
          height: 300px;
          animation-duration: 16s;
          animation-delay: -4s;
        }
        .orb-3 {
          bottom: 14%;
          left: 20%;
          width: 280px;
          height: 280px;
          animation-duration: 18s;
          animation-delay: -7s;
        }
        .orb-4 {
          bottom: 10%;
          right: 16%;
          width: 320px;
          height: 320px;
          animation-duration: 20s;
          animation-delay: -10s;
        }

        /* back-and-forth motion (horizontal) + slight vertical breathing */
        @keyframes orbSide {
          0% {
            transform: translate3d(-18px, 0px, 0) scale(1);
          }
          50% {
            transform: translate3d(18px, -10px, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-18px, 0px, 0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float {
            animation: none;
          }
          .orb {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
