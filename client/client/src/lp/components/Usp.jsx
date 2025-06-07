import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaLaptopCode,
  FaRegHandshake,
  FaUsers,
  FaRegLightbulb,
  FaChartLine,
  FaShieldAlt,
  FaCog,
  FaRegClock,
} from "react-icons/fa";

const usps = [
  {
    Icon: FaCheckCircle,
    title: "Proven Performance",
    description:
      "We provide data-driven insights to enhance your skills, ensuring you stay ahead of the competition.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    Icon: FaLaptopCode,
    title: "Tech-First Approach",
    description:
      "Stay up to date with the latest in tech trends and industry standards through personalized roadmaps.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    Icon: FaRegHandshake,
    title: "Industry Connections",
    description:
      "Join a vast community of professionals and recruiters to help you network and grow in your career.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    Icon: FaUsers,
    title: "Collaborative Learning",
    description:
      "Benefit from collaborative learning through workshops, events, and online communities.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    Icon: FaRegLightbulb,
    title: "Smart Insights",
    description:
      "AI-driven insights to help you understand your strengths and areas for improvement.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    Icon: FaChartLine,
    title: "Growth-Oriented",
    description:
      "Receive personalized growth recommendations to boost your career trajectory.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    Icon: FaShieldAlt,
    title: "Data Security",
    description:
      "Rest easy knowing your personal information and work data are secure with our top-tier encryption.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    Icon: FaCog,
    title: "Customizable Tools",
    description:
      "Our platform offers customizable features that allow you to tailor your career journey.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    Icon: FaRegClock,
    title: "Save Time",
    description:
      "We help you streamline your job search and skill-building efforts, saving you valuable time.",
    gradient: "from-rose-500 to-pink-500",
  },
];

const Usp = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="relative bg-slate-900 py-24 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
               linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose Us?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the features that make our platform the perfect choice for
            your tech career journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {usps.map((usp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="h-full p-8 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${usp.gradient} mb-6`}
                >
                  <usp.Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {usp.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {usp.description}
                </p>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${usp.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10 blur-xl`}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Usp;
