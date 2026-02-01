"use client";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardList,
  FaComments,
  FaBell,
  FaChartLine,
} from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaUserGraduate className="w-6 h-6" />,
      title: "Student Dashboard",
      description:
        "Access courses, attendance, grades, and communication — all in one place.",
    },
    {
      icon: <FaChalkboardTeacher className="w-6 h-6" />,
      title: "Teacher Management",
      description:
        "Simplify lecture scheduling, assignments, and student progress tracking.",
    },
    {
      icon: <FaClipboardList className="w-6 h-6" />,
      title: "Attendance & Reports",
      description:
        "Track attendance digitally and generate instant, detailed reports.",
    },
    {
      icon: <FaComments className="w-6 h-6" />,
      title: "Messaging System",
      description:
        "Enable seamless communication between students, teachers, and wardens.",
    },
    {
      icon: <FaBell className="w-6 h-6" />,
      title: "Smart Notifications",
      description:
        "Get real-time updates on assignments, announcements, and events.",
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Performance Analytics",
      description:
        "Monitor academic performance with AI-driven insights and visual dashboards.",
    },
  ];

  return (
    <section id="features" className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Powerful Features for a{" "}
            <span className="text-[#736bff]">Connected Campus</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything your university needs — from attendance to analytics —
            designed for simplicity and collaboration.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#736bff]/60 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#736bff]/10 rounded-lg flex items-center justify-center mb-4 text-[#736bff] group-hover:bg-[#736bff] group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
