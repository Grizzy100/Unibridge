"use client";

import React from "react";
import {
  FaChartLine,
  FaEnvelopeOpenText,
  FaTasks,
  FaBell,
  FaUserShield,
  FaUserFriends,
  FaBolt,
} from "react-icons/fa";

// [left%, top%, radiusPx, delayS, durationS]
const STARS: [number, number, number, number, number][] = [
  [2, 4, 1, 0, 3.2], [6, 12, 0.8, 0.5, 4.1], [11, 7, 1.2, 1.2, 3.8],
  [15, 22, 0.9, 0.8, 4.5], [19, 11, 1, 0.3, 3.6], [24, 18, 0.7, 1.5, 4.2],
  [29, 5, 1.1, 0.7, 3.4], [33, 28, 0.8, 1.1, 4.8], [38, 14, 1, 0.4, 3.9],
  [43, 9, 0.9, 1.8, 4.3], [47, 23, 1.2, 0.2, 3.7], [52, 6, 0.8, 1.4, 4.6],
  [57, 17, 1, 0.9, 3.5], [61, 29, 0.7, 0.6, 4.1], [66, 8, 1.1, 1.7, 3.8],
  [71, 21, 0.9, 0.1, 4.4], [75, 13, 1.2, 1.3, 3.6], [80, 26, 0.8, 0.8, 4.7],
  [85, 4, 1, 1.6, 3.3], [90, 19, 0.7, 0.4, 4.2], [95, 11, 1.1, 1.0, 3.9],
  [4, 36, 0.9, 0.7, 4.5], [8, 44, 1.2, 1.4, 3.7], [13, 51, 0.8, 0.2, 4.0],
  [17, 39, 1, 1.8, 3.4], [22, 58, 0.7, 0.5, 4.6], [26, 47, 1.1, 1.1, 3.8],
  [31, 33, 0.9, 0.9, 4.3], [36, 55, 1.2, 0.3, 3.6], [40, 42, 0.8, 1.6, 4.1],
  [45, 63, 1, 0.6, 3.9], [49, 37, 0.7, 1.3, 4.7], [54, 50, 1.1, 0.1, 3.5],
  [58, 45, 0.9, 1.7, 4.4], [63, 60, 0.8, 0.8, 3.8], [68, 35, 1.2, 1.2, 4.2],
  [72, 53, 1, 0.4, 3.7], [77, 41, 0.7, 1.5, 4.0], [82, 57, 1.1, 0.7, 3.6],
  [86, 33, 0.9, 1.9, 4.5], [91, 48, 1.2, 0.3, 3.3], [97, 39, 0.8, 1.1, 4.8],
  [3, 68, 1, 0.5, 4.1], [7, 75, 0.7, 1.4, 3.7], [12, 82, 1.1, 0.8, 4.4],
  [16, 71, 0.9, 1.7, 3.5], [21, 88, 1.2, 0.2, 4.6], [25, 77, 0.8, 1.3, 3.9],
  [30, 64, 1, 0.6, 4.2], [34, 91, 0.7, 0.9, 3.6], [39, 79, 1.1, 1.6, 4.0],
  [43, 69, 0.9, 0.3, 3.8], [48, 85, 1.2, 1.2, 4.5], [52, 74, 0.8, 0.7, 3.4],
  [57, 92, 1, 1.5, 4.3], [61, 67, 0.7, 0.4, 3.7], [66, 83, 1.1, 1.8, 4.1],
  [70, 72, 0.9, 0.1, 3.9], [75, 89, 0.8, 1.4, 4.6], [79, 76, 1.2, 0.9, 3.5],
  [84, 65, 1, 0.6, 4.2], [88, 87, 0.7, 1.3, 3.8], [93, 73, 1.1, 0.2, 4.4],
  [98, 80, 0.9, 1.7, 3.6], [1, 55, 1.2, 0.5, 4.0], [10, 97, 0.8, 1.1, 3.7],
  [20, 95, 1, 0.8, 4.3], [35, 97, 0.7, 1.5, 3.5], [50, 96, 1.1, 0.3, 4.7],
  [65, 94, 0.9, 1.6, 3.8], [78, 98, 1.2, 0.6, 4.1], [92, 93, 0.8, 1.2, 3.6],
  [15, 60, 1, 0.4, 4.4], [46, 31, 0.7, 1.8, 3.9], [73, 62, 1.1, 0.2, 4.2],
  [88, 44, 0.9, 1.0, 3.7], [5, 90, 1.2, 0.7, 4.5], [42, 20, 0.8, 1.5, 3.4],
];

/* ─── pill data ──────────────────────────────────────────────────────────
   cx/cy are in the 800x680 SVG coordinate space.
   side: which side of the node the pill floats toward.
   ────────────────────────────────────────────────────────────────────── */
const OUTER_PILLS = [
  { key: "notifications", text: "Smart Notifications",  icon: FaBell,             cx: 193, cy: 195, side: "left"  as const },
  { key: "attendance",    text: "Attendance Insights",  icon: FaChartLine,        cx: 100, cy: 340, side: "left"  as const },
  { key: "mail",          text: "Mail Regulation",      icon: FaEnvelopeOpenText, cx: 193, cy: 485, side: "left"  as const },
  { key: "warden",        text: "Warden Automation",    icon: FaUserShield,       cx: 607, cy: 485, side: "right" as const },
  { key: "tasks",         text: "Task Stacking",        icon: FaTasks,            cx: 700, cy: 340, side: "right" as const },
  { key: "flow",          text: "Faster Daily Flow",    icon: FaBolt,             cx: 607, cy: 195, side: "right" as const },
];

// Inner nodes moved off the horizontal centre line to avoid overlapping outer pills
const INNER_PILLS = [
  { key: "parent", text: "Parent Automation", icon: FaUserFriends, cx: 235, cy: 405, side: "left"  as const },
  { key: "speed",  text: "Real-time Updates", icon: FaBolt,        cx: 565, cy: 275, side: "right" as const },
];

const ALL_PILLS = [...OUTER_PILLS, ...INNER_PILLS];

/* ─── component ─────────────────────────────────────────────────────── */
export default function WhyUs() {
  return (
    // No overflow-hidden on the section so pills can extend past the SVG box edges
    <section className="relative py-24 px-6 bg-[#05070B]">

      {/* ── starfield (clipped to section bounds) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {STARS.map(([l, t, r, delay, dur], i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left:              `${l}%`,
              top:               `${t}%`,
              width:             `${r * 2}px`,
              height:            `${r * 2}px`,
              opacity:           0,
              animation:         `twinkle ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── radial glow ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_65%,rgba(115,107,255,0.13)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ── heading ── */}
        <div className="mx-auto mb-2 max-w-3xl text-center">
          <h2 className="text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] text-white leading-tight">
            Why{" "}
            <span className="bg-linear-to-r from-[#a78bfa] via-[#736bff] to-[#6366f1] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(115,107,255,0.7)]">
              UniBridge
            </span>
          </h2>
          <p className="mt-5 text-[15px] md:text-[16px] leading-[1.7] text-[#B9C2CF] max-w-[680px] mx-auto">
            With UniBridge, discover innovative ways to streamline campus operations for everyone
            — students, wardens, and parents alike. Build seamless automation strategies across the
            institution, improving productivity with enhanced workflow solutions. This scalable
            platform creates intelligent flows with real-time clarity.
          </p>
        </div>

        {/* ── arc diagram ── */}
        {/*
          The outer div is 800px wide at most, centred. Pills may extend outside it but
          the section (max-w-6xl = 1152px) has enough room on both sides to show them.
        */}
        <div
          className="relative mx-auto mt-6"
          style={{ maxWidth: 800, height: 680 }}
        >
          {/* ────── SVG arcs + nodes ────── */}
          <svg
            viewBox="0 0 800 680"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wuArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.85" />
                <stop offset="50%"  stopColor="#736bff" stopOpacity="1"    />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.85" />
              </linearGradient>

              <filter id="wuGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="wuNodeGlow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="wuPulse">
                <stop offset="0%"   stopColor="#736bff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#736bff" stopOpacity="0"    />
              </radialGradient>
            </defs>

            {/* outer circle top arc */}
            <path d="M 100 340 A 300 300 0 0 1 700 340"
              fill="none" stroke="url(#wuArcGrad)" strokeWidth="1.6"
              filter="url(#wuGlow)" opacity="0.9" />
            {/* outer circle bottom arc */}
            <path d="M 700 340 A 300 300 0 0 1 100 340"
              fill="none" stroke="url(#wuArcGrad)" strokeWidth="1.6"
              filter="url(#wuGlow)" opacity="0.45" />

            {/* inner circle top arc */}
            <path d="M 220 340 A 180 180 0 0 1 580 340"
              fill="none" stroke="url(#wuArcGrad)" strokeWidth="1.2"
              filter="url(#wuGlow)" opacity="0.7" />
            {/* inner circle bottom arc */}
            <path d="M 580 340 A 180 180 0 0 1 220 340"
              fill="none" stroke="url(#wuArcGrad)" strokeWidth="1.2"
              filter="url(#wuGlow)" opacity="0.32" />

            {/* centre hub */}
            <circle cx="400" cy="340" r="42" fill="#736bff" opacity="0.04" />
            <circle cx="400" cy="340" r="26" fill="#736bff" opacity="0.07" />
            <circle cx="400" cy="340" r="9"  fill="#736bff" filter="url(#wuNodeGlow)" opacity="0.95" />

            {/* dashed connector lines from hub to every node */}
            {ALL_PILLS.map((p) => (
              <line
                key={`line-${p.key}`}
                x1="400" y1="340" x2={p.cx} y2={p.cy}
                stroke="#736bff" strokeWidth="0.55"
                strokeDasharray="4 5" opacity="0.22"
              />
            ))}

            {/* outer nodes */}
            {OUTER_PILLS.map((p) => (
              <g key={`node-${p.key}`}>
                <circle cx={p.cx} cy={p.cy} r="16" fill="url(#wuPulse)"
                  style={{ animation: "wuPulseRing 2.6s ease-out infinite" }} />
                <circle cx={p.cx} cy={p.cy} r="9"  fill="none"
                  stroke="#736bff" strokeWidth="1" opacity="0.45" />
                <circle cx={p.cx} cy={p.cy} r="5"  fill="#736bff"
                  filter="url(#wuNodeGlow)" />
              </g>
            ))}

            {/* inner nodes */}
            {INNER_PILLS.map((p) => (
              <g key={`node-${p.key}`}>
                <circle cx={p.cx} cy={p.cy} r="9"  fill="none"
                  stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
                <circle cx={p.cx} cy={p.cy} r="5"  fill="#a78bfa"
                  filter="url(#wuNodeGlow)" />
              </g>
            ))}
          </svg>

          {/* ────── floating pill badges ────── */}
          {ALL_PILLS.map((p, i) => {
            const isLeft  = p.side === "left";
            const leftPct = (p.cx / 800) * 100;
            const topPct  = (p.cy / 680) * 100;
            return (
              <div
                key={p.key}
                className="absolute"
                style={{
                  left:            isLeft ? undefined : `${leftPct}%`,
                  right:           isLeft ? `${100 - leftPct}%` : undefined,
                  top:             `${topPct}%`,
                  transform:       "translateY(-50%)",
                  // horizontal nudge away from node
                  marginLeft:      isLeft ? undefined : "22px",
                  marginRight:     isLeft ? "22px"    : undefined,
                  animation:       `wuFloat ${4.5 + i * 0.3}s ease-in-out ${i * 0.35}s infinite`,
                  zIndex:          10,
                }}
              >
                <PillBadge icon={p.icon} text={p.text} small={i >= OUTER_PILLS.length} />
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%  , 100% { opacity: 0;    transform: scale(1);    }
          50%         { opacity: 0.75; transform: scale(1.15); }
        }
        @keyframes wuFloat {
          0%  , 100% { margin-top:  0px; }
          50%          { margin-top: -7px; }
        }
        @keyframes wuPulseRing {
          0%   { r: 10; opacity: 0.5; }
          100% { r: 22; opacity: 0;   }
        }
      `}</style>
    </section>
  );
}

/* ─── pill badge ─────────────────────────────────────────────────── */
function PillBadge({
  icon: Icon,
  text,
  small = false,
}: {
  icon: React.ElementType;
  text: string;
  small?: boolean;
}) {
  return (
    <div
      className={`
        inline-flex items-center gap-2 whitespace-nowrap
        rounded-full border border-[#736bff]/40
        bg-[#0d0b1e]/85 backdrop-blur-md
        shadow-[0_0_18px_rgba(115,107,255,0.22)]
        text-white/90 font-medium tracking-wide
        transition-all duration-300
        hover:border-[#736bff]/75
        hover:shadow-[0_0_28px_rgba(115,107,255,0.45)]
        ${small ? "px-4 py-2 text-[12px]" : "px-5 py-2.5 text-[13px]"}
      `}
    >
      <Icon className="text-[#a78bfa] shrink-0" size={small ? 11 : 13} />
      {text}
    </div>
  );
}