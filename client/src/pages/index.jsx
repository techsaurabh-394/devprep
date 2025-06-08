import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaUsers, FaBrain, FaCalendarAlt, FaBook } from 'react-icons/fa'; // Import React Icons

const Index = () => {
  const features = [
    {
      title: "Skills",
      description: "Master cutting-edge technical skills with personalized learning paths and expert-curated resources.",
      icon: <FaCode className="w-8 h-8 text-white" />, // White Icon
      to: "/roadmap",
      gradient: "from-blue-600 to-indigo-600",
      hoverGradient: "hover:from-blue-700 hover:to-indigo-700",
      iconBg: "from-blue-600 to-indigo-600"
    },
    {
      title: "Community",
      description: "Connect with industry leaders and innovators in a thriving professional ecosystem.",
      icon: <FaUsers className="w-8 h-8 text-white" />, // White Icon
      to: "/community",
      gradient: "from-emerald-600 to-teal-600",
      hoverGradient: "hover:from-emerald-700 hover:to-teal-700",
      iconBg: "from-emerald-600 to-teal-600"
    },
    {
      title: "AI Tutor",
      description: "Leverage advanced AI solutions to transform your workflow and drive innovation.",
      icon: <FaBrain className="w-8 h-8 text-white" />, // White Icon
      to: "/esmoai",
      gradient: "from-violet-600 to-purple-600",
      hoverGradient: "hover:from-violet-700 hover:to-purple-700",
      iconBg: "from-violet-600 to-purple-600"
    },
    {
      title: "Find Events",
      description: "Access exclusive industry events and high-impact networking opportunities.",
      icon: <FaCalendarAlt className="w-8 h-8 text-white" />, // White Icon
      to: "/findevents",
      gradient: "from-rose-600 to-pink-600",
      hoverGradient: "hover:from-rose-700 hover:to-pink-700",
      iconBg: "from-rose-600 to-pink-600"
    },
    {
      title: "Personalized Roadmaps and Resources",
      description: "Access exclusive, tailored roadmaps and resource guides for achieving your career goals.",
      icon: <FaBook className="w-8 h-8 text-white" />, // White Icon
      to: "/personalized-roadmap",  // Updated route
      gradient: "from-teal-600 to-cyan-600", // New Gradient
      hoverGradient: "hover:from-teal-700 hover:to-cyan-700", // New Hover Gradient
      iconBg: "from-teal-600 to-cyan-600", // New Gradient for the icon
      boxStyle: "col-span-full w-full"  // Ensure this box takes the full width
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Improve your
            <span className="relative inline-block mx-2">
              <span
                className="relative inline-block before:absolute before:inset-0 before:-skew-y-3 before:bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <span className="relative text-white px-2">Skills</span>
              </span>
            </span>
            and
            <span className="relative inline-block mx-2">
              <span
                className="relative inline-block before:absolute before:inset-0 before:-skew-y-3 before:bg-gradient-to-r from-green-500 to-teal-500"
              >
                <span className="relative text-white px-2">Networking</span>
              </span>
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Elevate your professional journey with our comprehensive suite of tools and resources.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.to}
              className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${feature.boxStyle || ''}`}
            >
              {/* Background Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.gradient}`}
              />

              {/* Content Container */}
              <div className="p-8 relative">
                <div className="flex items-start gap-6">
                  {/* Icon Container */}
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${feature.iconBg}`}
                  >
                    {feature.icon} {/* Render Icon */}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h2
                      className={`text-2xl font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-3`}
                    >
                      {feature.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Gradient Line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r ${feature.gradient}`}
                />
              </div>

              {/* Hover Effect with "Get Started" */}
              <div
                className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${feature.gradient} bg-opacity-20`}
              >
                <span
                  className="px-6 py-3 text-sm font-medium bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                  Get Started
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
