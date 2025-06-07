import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaHome,
  FaSuitcase,
  FaCode,
  FaUserCircle,
  FaCalendarAlt,
  FaSignOutAlt,
  FaLaptopCode,
  FaKeyboard,
} from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import navbarlogo from "../assets/devprep_logo.png";

const Sidebar = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // This will handle token removal and state updates
    navigate("/"); // Navigate to landing page
  };

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col p-6 sticky top-0 left-0 shadow-2xl overflow-y-auto border-r border-white/10">
      {/* Logo Section */}
      <div className="relative flex justify-center mb-8 group">
        <img
          src={navbarlogo}
          alt="Logo"
          className="w-70 h-21 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 rounded-xl transition-colors duration-300" />
      </div>

      {/* Navigation Sections */}
      <div className="flex-grow space-y-3 mb-6">
        {[
          { to: "/home", icon: <FaHome />, text: "Home" },
          { to: "/Interview", icon: <SiGooglemeet />, text: "Interview" },
          { to: "/career", icon: <FaSuitcase />, text: "Resume" },
          { to: "/skills", icon: <FaCode />, text: "Skill Development" },
          {
            to: "/plan-your-day",
            icon: <FaCalendarAlt />,
            text: "Plan Your Day",
          },
          {
            to: "/machine-coding",
            icon: <FaLaptopCode />,
            text: "Machine Coding",
          },
          {
            to: "/typing-test",
            icon: <FaKeyboard />,
            text: "Enhance Typing Skill",
          },
          { to: "/userprofile", icon: <FaUserCircle />, text: "Profile" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="text-xl relative z-10 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
              {item.icon}
            </span>
            <span className="font-medium relative z-10 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
              {item.text}
            </span>
          </Link>
        ))}
      </div>

      {/* Logout Section */}
      <div
        onClick={handleLogout}
        className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-primary-600/20 to-primary-600/10 hover:from-primary-600/30 hover:to-primary-600/20 cursor-pointer transition-all duration-300 group mt-auto"
      >
        <FaSignOutAlt className="text-xl text-primary-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-medium text-primary-400 group-hover:translate-x-1 transition-transform duration-300">
          Logout
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
