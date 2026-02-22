"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import {
  LuLayoutDashboard,
  LuBookOpen,
  LuClipboardCheck,
  LuBell,
  LuTrendingUp,
  LuMail,
} from "react-icons/lu";
import { RiMailLockFill } from "react-icons/ri";
import { MdNotificationAdd } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { LuScanLine } from "react-icons/lu";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentLight } from "react-icons/pi";



/* ---------------- Mockups using real screenshots ---------------- */

const StudentDashboardMockup = ({ isHovering }: { isHovering: boolean }) => (
  <motion.div
    className="mb-3 overflow-hidden rounded-[4px] border border-gray-200 bg-gray-50 scale-90"
    animate={{ opacity: isHovering ? 1 : 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src="/studentdashboard.png"
      alt="Student Dashboard"
      className="w-full h-32 object-cover object-top"
    />
  </motion.div>
);


const TeacherManagementMockup = ({ isHovering }: { isHovering: boolean }) => (
  <motion.div
    className="mb-3 overflow-hidden rounded-[4px] border border-gray-200 bg-gray-50"
    animate={{ opacity: isHovering ? 1 : 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src="/teacherdashboard.png"
      alt="Teacher Dashboard"
      className="w-full h-32 object-cover object-top"
    />
  </motion.div>
);


const AttendanceMockup = ({ isHovering }: { isHovering: boolean }) => (
  <motion.div
    className="mb-3 overflow-hidden rounded-[4px] border border-gray-200 bg-gray-50"
    animate={{ opacity: isHovering ? 1 : 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src="/studentdashboard.png"
      alt="Attendance"
      className="w-full h-32 object-cover object-center"
    />
  </motion.div>
);


const MailMockup = ({ isHovering }: { isHovering: boolean }) => (
  <motion.div
    className="mb-3 overflow-hidden rounded-[4px] border border-gray-200 bg-gray-50"
    animate={{ opacity: isHovering ? 1 : 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src="/mail.png"
      alt="Campus Mail Service"
      className="w-full h-32 object-cover object-top"
    />
  </motion.div>
);


const NotificationsMockup = ({ isHovering }: { isHovering: boolean }) => (
  <motion.div
    className="mb-3 overflow-hidden rounded-[4px] border border-gray-200 bg-gray-50"
    animate={{ opacity: isHovering ? 1 : 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src="/notification.png"
      alt="Notifications"
      className="w-full h-32 object-cover object-top"
    />
  </motion.div>
);


const AnalyticsMockup = ({ isHovering }: { isHovering: boolean }) => (
  <motion.div
    className="mb-3 overflow-hidden rounded-[4px] border border-gray-200 bg-gray-50"
    animate={{ opacity: isHovering ? 1 : 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src="/studentdashboard.png"
      alt="Analytics"
      className="w-full h-32 object-cover object-bottom"
    />
  </motion.div>
);

/* ---------------- Feature Card ---------------- */

interface FeatureCardProps {
  index: number;
  feature: any;
  Mockup: any;
}

function FeatureCard({ index, feature, Mockup }: FeatureCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{
        y: -1,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="bg-white border border-gray-200 rounded-[6px] p-[18px] transition-all duration-200"
    >
      <Mockup isHovering={isHovering} />

      <div className="w-[32px] h-[32px] bg-[#736bff]/10 flex items-center justify-center rounded-[4px] mb-[10px]">
        <feature.icon className="w-4 h-4 text-[#736bff]" />
      </div>

      <h3 className="text-[14.5px] font-medium tracking-[-0.01em] text-gray-900 mb-[4px]">
        {feature.title}
      </h3>

      <p className="text-[13.5px] leading-[1.55] tracking-[-0.005em] text-gray-600">
        {feature.description}
      </p>
    </motion.div>
  );
}

/* ---------------- Feature Data ---------------- */

const features = [
  {
    icon: LuLayoutDashboard,
    title: "Student Dashboard",
    description:
      "Access enrolled courses, track attendance, view submissions, and manage academic progress from a single interface.",
    mockup: StudentDashboardMockup,
  },
  {
    icon: FaChalkboardTeacher,
    title: "Teacher Management",
    description:
      "Create tasks, monitor student submissions, extend deadlines, and manage classroom workflows efficiently.",
    mockup: TeacherManagementMockup,
  },
  {
    icon: LuScanLine,
    title: "Attendance & Reports",
    description:
      "Start attendance sessions, generate secure QR codes, and maintain accurate attendance records automatically.",
    mockup: AttendanceMockup,
  },
  {
    icon: RiMailLockFill,
    title: "Mail Service",
    description:
      "Exchange secure institutional mail between students, teachers, and wardens with attachments and organized inbox management.",
    mockup: MailMockup,
  },
  {
    icon: MdNotificationAdd,
    title: "Smart Notifications",
    description:
      "Deliver real-time alerts for new tasks, deadline updates, attendance events, and system announcements.",
    mockup: NotificationsMockup,
  },
  {
    icon: VscGraph,
    title: "Performance Analytics",
    description:
      "Analyze attendance trends, submission activity, and academic performance through visual dashboards.",
    mockup: AnalyticsMockup,
  },
];

/* ---------------- Main Section ---------------- */

export default function Features() {
  return (
    <section className="py-[72px] bg-gradient-to-b from-white via-[#fcfcff] to-white">
      <div className="max-w-[980px] mx-auto px-6">

        <div className="text-center mb-[48px]">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-500 mb-[16px]">
            Features
          </p>

          <h2 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] leading-[1.15] text-gray-900 mb-[12px]">
            Powerful tools for a{" "}
            <span className="text-[#736bff]">connected campus</span>
          </h2>

          <p className="text-[15px] leading-[1.6] tracking-[-0.005em] text-gray-600 max-w-[520px] mx-auto">
            UniBridge provides a unified system to manage academic workflows,
            communication, attendance, and performance insights across the institution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              feature={feature}
              Mockup={feature.mockup}
            />
          ))}
        </div>

      </div>
    </section>
  );
}