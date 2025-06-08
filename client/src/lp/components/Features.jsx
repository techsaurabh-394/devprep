import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaCode, FaFileAlt, FaBrain } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      Icon: FaRocket,
      name: "Personalized Learning Path",
      description:
        "Get a customized roadmap tailored to your career goals and current skill level.",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      Icon: FaCode,
      name: "Technical Interview Prep",
      description:
        "Practice with real interview questions and get AI-powered feedback.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      Icon: FaFileAlt,
      name: "Smart Resume Builder",
      description:
        "Create ATS-friendly resumes with our intelligent resume builder.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      Icon: FaBrain,
      name: "AI-Powered Assistance",
      description:
        "Get instant feedback and suggestions powered by advanced AI.",
      gradient: "from-pink-500 to-orange-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div id="features" className="relative bg-slate-900 py-24">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to accelerate your tech career, all in one
            place.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="h-full p-8 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}
                >
                  <feature.Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.name}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/signup"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
          >
            Get Started Now
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
