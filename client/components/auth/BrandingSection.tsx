import { FaGraduationCap, FaBook, FaUserShield, FaEnvelope } from "react-icons/fa";
import React from "react";

// Main Branding Component
export default function BrandingSection() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 items-center justify-center p-12">
      <div className="max-w-lg text-white">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-20 h-20 bg-slate-700/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <FaGraduationCap className="text-4xl text-white/80" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold mb-4 text-center">
          Connect Your University Life
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-center mb-12 leading-relaxed">
          UniBridge brings together students, teachers, and wardens in one seamless platform. 
          Manage courses, track attendance, and foster communication effortlessly.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            icon={<FaGraduationCap />}
            title="For Students"
            description="Access courses, submit assignments, and track your progress"
          />
          <FeatureCard
            icon={<FaBook />}
            title="For Teachers"
            description="Manage classes, grade assignments, and communicate with students"
          />
          <FeatureCard
            icon={<FaUserShield />}
            title="For Wardens"
            description="Monitor hostel activities and ensure student welfare"
          />
          <FeatureCard
            icon={<FaEnvelope />}
            title="Unified Portal"
            description="One platform for all university communications"
          />
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-slate-900"></div>
            <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-slate-900"></div>
            <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-slate-900"></div>
          </div>
          <div className="text-sm text-slate-400">
            <span className="font-semibold text-white">+10k</span> Trusted by students and faculty
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-slate-800/40 rounded-lg p-5 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:border-slate-500/50 hover:bg-slate-800/60 hover:scale-105">
      <div className="text-2xl mb-3 text-white/70">{icon}</div>
      <h3 className="font-semibold text-white mb-1 text-sm">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
