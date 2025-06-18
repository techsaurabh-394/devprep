import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative bg-slate-900 text-white pt-20 pb-10 overflow-hidden">
      {/* Animated Background */}
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

      {/* Decorative Blobs */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Column */}
          <motion.div
            variants={fadeInUpVariant}
            className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50"
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              DevPrep
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Unlock the resources, guidance, and community you need to master
              tech skills, land your dream job, and accelerate your career
              growth.
            </p>
            <div className="flex gap-6 text-2xl">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map(
                (Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.2, color: "#22d3ee" }}
                    className="text-gray-400 transition-colors"
                  >
                    <Icon />
                  </motion.a>
                )
              )}
            </div>
          </motion.div>

          {/* Middle Column */}
          <motion.div
            variants={fadeInUpVariant}
            className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50"
          >
            <h4 className="text-xl font-bold text-cyan-400 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "Features", "Roadmap", "Community", "Contact"].map(
                (link) => (
                  <motion.li key={link} whileHover={{ x: 5 }}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Right Column */}
          <motion.div
            variants={fadeInUpVariant}
            className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50"
          >
            <h4 className="text-xl font-bold text-cyan-400 mb-6">Contact Us</h4>
            <p className="text-gray-400 mb-4">
              Have questions? Reach out to us anytime.
            </p>
            <motion.a
              href="mailto:saurabh@mernstackdev.com"
              className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center group"
              whileHover={{ x: 5 }}
            >
              saurabh@mernstackdev.com
              <svg
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-gray-400 pt-8 border-t border-slate-800"
        >
          <p>© 2025 DevPrep. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
