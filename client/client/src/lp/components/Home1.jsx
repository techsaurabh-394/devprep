import React from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Globe1 from "../../assets/Globe1.png";
import Globe2 from "../../assets/Globe2.png";

const LandingPage = () => {
  return (
    <div
      id="home"
      className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden"
    >
      {/* Animated Background with Grid */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
               linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Globes */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 opacity-40"
        animate={{
          y: [0, 20, 0],
          rotate: 360,
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <img
          src={Globe1}
          alt="Globe"
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-0 w-72 h-72 opacity-30"
        animate={{
          y: [0, -20, 0],
          rotate: -360,
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <img
          src={Globe2}
          alt="Globe"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-20 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Heading */}
          <motion.h1
            className="text-7xl md:text-8xl font-bold text-center leading-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Master Your
            </span>
            <div className="mt-2">
              <motion.span
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="relative inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-lg">
                  <span className="relative text-white">Tech Journey</span>
                </span>
              </motion.span>
            </div>
          </motion.h1>

          {/* Animated Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-center font-medium text-gray-400 mt-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your all-in-one platform for interview preparation, resume building,
            <br className="hidden md:block" />
            and career advancement in the tech industry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              Get Started Free
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold text-gray-300 border-2 border-gray-700 hover:border-gray-600 rounded-xl hover:bg-gray-800/50 transition-all duration-300"
            >
              Explore Features
            </motion.a>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { number: "10k+", label: "Active Users" },
              { number: "500+", label: "Interview Questions" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.number}
                </h3>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
