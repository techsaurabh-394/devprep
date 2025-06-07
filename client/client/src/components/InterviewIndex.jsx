import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaChalkboardTeacher, FaLaptopCode, FaShieldAlt, FaCloud, 
         FaDesktop, FaDatabase, FaRobot, FaCode, FaBug, FaPencilRuler, FaServer,
         FaArrowRight } from 'react-icons/fa';

const InterviewIndex = () => {
  const roles = [
    { 
      name: "SDE-1", 
      description: "Entry-level software development role for Freshers.",
      icon: FaCode,
      color: "blue"
    },
    { 
      name: "SDE-2", 
      description: "Mid-level role for experienced developers.",
      icon: FaLaptopCode,
      color: "indigo"
    },
    { 
      name: "SDE-3", 
      description: "Senior-level role with leadership responsibilities.",
      icon: FaChalkboardTeacher,
      color: "purple"
    },
    { 
      name: "Data Analyst", 
      description: "Responsible for analyzing and interpreting complex data to help companies make decisions.",
      icon: FaDatabase,
      color: "cyan"
    },
    { 
      name: "Data Scientist", 
      description: "Uses algorithms and machine learning to analyze complex data sets.",
      icon: FaRobot,
      color: "teal"
    },
    { 
      name: "Cybersecurity Engineer", 
      description: "Ensures systems and networks are secure from cyber threats and vulnerabilities.",
      icon: FaShieldAlt,
      color: "red"
    },
    { 
      name: "DevOps Engineer", 
      description: "Focuses on automating and improving the software development and deployment process.",
      icon: FaServer,
      color: "orange"
    },
    { 
      name: "QA Engineer", 
      description: "Ensures the quality of software by writing test cases and identifying issues in software products.",
      icon: FaBug,
      color: "amber"
    },
    { 
      name: "UI/UX Designer", 
      description: "Designs user-friendly interfaces and improves the user experience for applications.",
      icon: FaPencilRuler,
      color: "pink"
    },
    { 
      name: "Cloud Engineer", 
      description: "Designs and manages cloud-based infrastructure for deploying applications and services.",
      icon: FaCloud,
      color: "sky"
    },
    { 
      name: "ML Engineer", 
      description: "Builds machine learning models to solve real-world problems through data-driven approaches.",
      icon: FaBriefcase,
      color: "violet"
    },
    { 
      name: "Full Stack Developer", 
      description: "Works on both the front-end and back-end of applications, creating end-to-end solutions.",
      icon: FaDesktop,
      color: "emerald"
    },
    { 
      name: "More Roles", 
      description: "Find Interview for other roles.",
      icon: FaCode,
      color: "emerald"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col items-center py-10">
        {/* Hero Section with Gradient Background */}
        <div className="w-full py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 mb-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Prepare for Your Next 
              <span className="relative inline-block mx-2">
                <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 
                               before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 relative inline-block">
                  <span className="relative text-white">Tech Interview</span>
                </span>
              </span>
            </h1>

            {/* Enhanced Subheading */}
            <p className="text-xl text-gray-600 mb-1 max-w-3xl mx-auto leading-relaxed">
              Choose your role and start practicing with role-specific interview questions, 
              coding challenges, and expert tips to excel in your next interview.
            </p>
          </div>
        </div>

        {/* Grid layout for roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-screen-xl">
          {roles.map((role) => {
            const Icon = role.icon;
            const routeTo = role.name === "More Roles" ? "/more-interviews" : `/interview/${role.name}`;
            return (
              <Link
                key={role.name}
                to={routeTo} // Routing to more-interviews for "More Roles"
                className={`group relative bg-white p-6 rounded-xl shadow-lg text-center 
                           border-b-4 border-${role.color}-500 hover:border-${role.color}-600
                           transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
              >
                <div className={`bg-${role.color}-50 p-4 rounded-full w-16 h-16 mx-auto mb-4
                                group-hover:bg-${role.color}-100 transition-colors duration-300`}>
                  <Icon className={`text-2xl text-${role.color}-500 group-hover:text-${role.color}-600 
                                  transition-all duration-300 group-hover:scale-110`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{role.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{role.description}</p>
                
                <div className={`flex items-center justify-center gap-2 text-${role.color}-500 
                                font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <span>Get Started</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 px-4 w-full max-w-screen-xl">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Excel in Your Interviews?</h2>
              <p className="text-xl mb-8 text-blue-50">Join thousands of successful developers who've landed their dream roles.</p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold 
                               hover:bg-blue-50 transition duration-300 transform hover:scale-105">
                Start Practicing Now
              </button>
            </div>
            <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewIndex;
