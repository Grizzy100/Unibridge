"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#f9f9ff] via-[#f5f4ff] to-white border-t border-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#736bff] rounded-lg flex items-center justify-center shadow-md">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">UniBridge</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A unified platform connecting students, faculty, and administration —
              simplifying university life with smart digital tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                  Attendance
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                  Announcements
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                  Library
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                  Study Material
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-gray-600 text-sm">
                📍 123 Knowledge Avenue, EduCity
              </li>
              <li className="text-gray-600 text-sm">📞 +91 98765 43210</li>
              <li className="text-gray-600 text-sm">✉️ support@unibridge.edu</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-[#736bff] transition-colors text-sm">
                Terms of Use
              </a>
            </div>

            <div className="text-gray-600 text-sm text-center md:text-right">
              © {new Date().getFullYear()} UniBridge. All Rights Reserved.
            </div>

            <div className="flex items-center space-x-4">
              {[
                { Icon: FaFacebookF, href: "#" },
                { Icon: FaTwitter, href: "#" },
                { Icon: FaLinkedinIn, href: "#" },
                { Icon: FaInstagram, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[#736bff] hover:text-white transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
