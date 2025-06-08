import React from 'react';
import { FaFileAlt, FaArrowRight, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Career = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header Section */}
      <div className="w-full py-24 px-4  bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Build Your{" "}
            <span className="relative inline-block">
              <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-gradient-to-r before:from-yellow-500 before:to-orange-500 relative inline-block">
                <span className="relative text-white">Dream Resume</span>
              </span>
            </span>
          </h1>
          <p className="text-xl text-center font-medium text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed">
            Start building your professional resume or enhance it with ATS-friendly features to stand out.
          </p>
        </div>
      </div>

      {/* Main Content Section with Two Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 max-w-screen-xl mb-12">
        {/* Left Box: Create/Generate Resume */}
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-b-4 border-yellow-500 transition transform hover:scale-105 hover:shadow-2xl group">
          <div className="bg-yellow-50 p-4 rounded-xl mb-6 inline-block group-hover:bg-yellow-100 transition">
            <FaFileAlt className="text-5xl text-yellow-500 group-hover:scale-110 transition" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Create Your Resume In Minutes</h3>
          <p className="text-gray-600 leading-relaxed mb-6">Easily create a professional resume with our step-by-step generator.</p>
          {/* Wrap the button in a Link to navigate to the ResumeForm page */}
          <Link
            to="/resume-form" // Use the path where the ResumeForm component is mapped
            className="text-yellow-500 font-semibold group-hover:text-yellow-600 transition flex items-center justify-center gap-2"
          >
            Get Started <FaArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Right Box: Enhance Your Resume (ATS Score) */}
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-b-4 border-orange-500 transition transform hover:scale-105 hover:shadow-2xl group">
          <div className="bg-orange-50 p-4 rounded-xl mb-6 inline-block group-hover:bg-orange-100 transition">
            <FaChartLine className="text-5xl text-orange-500 group-hover:scale-110 transition" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Enhance Your Resume</h3>
          <p className="text-gray-600 leading-relaxed mb-6">Boost your resume with ATS-friendly optimization to ensure you get noticed.</p>
          <Link
            to="/resume-enchancer" // Use the path where the ResumeForm component is mapped
            className="text-yellow-500 font-semibold group-hover:text-yellow-600 transition flex items-center justify-center gap-2"
          >
          <div className="text-orange-500 font-semibold group-hover:text-orange-600 transition flex items-center justify-center gap-2">
            Improve Now <FaArrowRight className="group-hover:translate-x-1 transition" />
          </div>
          </Link>
        </div>
      </div>

      {/* Bottom CTA Box */}
      <div className="px-4 max-w-screen-xl w-full mb-16">
        <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-white py-16 px-8 text-center shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px]"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold mb-6">Ready to Take Action?</h2>
            <p className="text-xl mb-8 text-yellow-50">Kickstart your career by crafting an outstanding resume today!</p>
            <button className="bg-white text-yellow-500 py-4 px-8 rounded-xl font-bold hover:bg-yellow-50 transition duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
