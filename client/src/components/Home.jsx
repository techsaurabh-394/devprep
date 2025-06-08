import React from "react";
import {
  FaLaptopCode,
  FaClipboardCheck,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import SEO from "./SEO";

const Home = () => {
  return (
    <>
      <SEO
        title="Online Developer Interview Preparation & Learning Platform"
        description="Prepare for tech interviews with AI-powered mock interviews, resume building, and personalized learning. Practice coding, system design, and improve your developer skills."
        keywords="mock technical interview, developer resume builder, coding practice platform, interview preparation, software engineer interview, tech interview questions"
      />
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-gray-900 dark:text-white mb-6 leading-tight">
              Ready to elevate your tech
              <div className="inline-flex flex-wrap items-center gap-2 mx-2">
                <span className="relative inline-block">
                  <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-gradient-to-r before:from-primary-500 before:to-primary-600 relative inline-block">
                    <span className="relative text-white">career</span>
                  </span>
                </span>
                and
                <span className="relative inline-block">
                  <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-gradient-to-r before:from-primary-600 before:to-primary-700 relative inline-block">
                    <span className="relative text-white">skills</span>
                  </span>
                </span>
              </div>
              to new heights?
            </h1>

            {/* Feature Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* Interview Prep Card */}
              <div className="card card-hover p-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-6 inline-block">
                  <FaLaptopCode className="text-4xl text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Interview Prep
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Master technical interviews with our AI-powered mock
                  interviews and comprehensive practice sessions.
                </p>
                <div className="text-primary-600 dark:text-primary-400 font-semibold group-hover:text-primary-700 transition flex items-center gap-2">
                  Learn More{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Resume Building Card */}
              <div className="card card-hover p-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-6 inline-block">
                  <FaClipboardCheck className="text-4xl text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Resume Building
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Create an impressive resume that highlights your skills and
                  experience effectively.
                </p>
                <div className="text-primary-600 dark:text-primary-400 font-semibold group-hover:text-primary-700 transition flex items-center gap-2">
                  Learn More{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Career Growth Card */}
              <div className="card card-hover p-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-6 inline-block">
                  <FaChartLine className="text-4xl text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Career Growth
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Learn strategies to grow your career and stand out in the tech
                  industry.
                </p>
                <div className="text-primary-600 dark:text-primary-400 font-semibold group-hover:text-primary-700 transition flex items-center gap-2">
                  Learn More{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 px-4 text-center">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 px-8 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Ready to Begin?
                  </h2>
                  <p className="text-xl mb-8 text-white/90">
                    Take the first step towards your dream career.
                  </p>
                  <button
                    className="bg-white text-primary-600 py-3 px-8 rounded-xl font-semibold 
                                   hover:bg-primary-50 transition duration-300 shadow-lg
                                   transform hover:scale-105 hover:shadow-xl"
                  >
                    Start Your Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
