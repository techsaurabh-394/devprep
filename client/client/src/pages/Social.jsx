import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter, FaStackOverflow, FaBook } from 'react-icons/fa';
import { SiLeetcode, SiCodeforces, SiDevpost } from 'react-icons/si';

const Social = () => {
  const profiles = [
    {
      title: "LinkedIn",
      description: "Optimize your LinkedIn profile to showcase your professional achievements and network effectively.",
      icon: <FaLinkedin className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/linkedin",
      gradient: "from-blue-600 to-indigo-600",
      hoverGradient: "hover:from-blue-700 hover:to-indigo-700",
      iconBg: "from-blue-600 to-indigo-600"
    },
    {
      title: "GitHub",
      description: "Enhance your GitHub profile to highlight your projects, contributions, and coding expertise.",
      icon: <FaGithub className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/github",
      gradient: "from-gray-600 to-black",
      hoverGradient: "hover:from-gray-700 hover:to-black",
      iconBg: "from-gray-600 to-black"
    },
    {
      title: "LeetCode",
      description: "Improve your LeetCode profile to showcase your problem-solving skills and coding achievements.",
      icon: <SiLeetcode className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/leetcode",
      gradient: "from-yellow-600 to-orange-600",
      hoverGradient: "hover:from-yellow-700 hover:to-orange-700",
      iconBg: "from-yellow-600 to-orange-600"
    },
    {
      title: "Twitter",
      description: "Build a strong Twitter presence to share insights, network, and stay updated with tech trends.",
      icon: <FaTwitter className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/twitter",
      gradient: "from-sky-600 to-blue-600",
      hoverGradient: "hover:from-sky-700 hover:to-blue-700",
      iconBg: "from-sky-600 to-blue-600"
    },
    {
      title: "Codeforce",
      description: "Enhance your Codeforces profile to showcase your competitive programming skills and rankings.",
      icon: <SiCodeforces className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/codeforces",
      gradient: "from-red-600 to-pink-600",
      hoverGradient: "hover:from-red-700 hover:to-pink-700",
      iconBg: "from-red-600 to-pink-600"
    },
    {
      title: "Devfolio",
      description: "Optimize your Devfolio profile to showcase your hackathon projects and developer portfolio.",
      icon: <SiDevpost className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/devfolio",
      gradient: "from-green-600 to-teal-600",
      hoverGradient: "hover:from-green-700 hover:to-teal-700",
      iconBg: "from-green-600 to-teal-600"
    },
    {
      title: "Stack Overflow",
      description: "Improve your Stack Overflow profile to highlight your contributions and expertise in tech communities.",
      icon: <FaStackOverflow className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/stackoverflow",
      gradient: "from-orange-600 to-amber-600",
      hoverGradient: "hover:from-orange-700 hover:to-amber-700",
      iconBg: "from-orange-600 to-amber-600"
    },
    {
      title: "Portfolio",
      description: "Build a stunning personal portfolio to showcase your projects, skills, and achievements.",
      icon: <FaBook className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      to: "/portfolio",
      gradient: "from-purple-600 to-violet-600",
      hoverGradient: "hover:from-purple-700 hover:to-violet-700",
      iconBg: "from-purple-600 to-violet-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 sm:p-8 md:p-16 lg:p-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Keeping original design as requested */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
            Enhance Your
            <span className="relative inline-block mx-2">
              <span
                className="relative inline-block before:absolute before:inset-0 before:-skew-y-3 before:bg-gradient-to-r from-green-400 to-emerald-600"
              >
                <span className="relative text-white px-2">Social Profiles</span>
              </span>
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Elevate your online presence with tailored tips and tools for each platform.
          </p>
        </div>

        {/* Profiles Grid - Improved responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {profiles.map((profile, index) => (
            <Link
              key={index}
              to={profile.to}
              className={`group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full`}
            >
              {/* Card Hover Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${profile.gradient}`}
              />

              {/* Content Container */}
              <div className="p-4 sm:p-6 md:p-8 relative flex flex-col h-full">
                <div className="flex items-start mb-4">
                  {/* Icon Container */}
                  <div
                    className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${profile.iconBg} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {profile.icon}
                  </div>
                  
                  {/* Title */}
                  <h2
                    className={`text-xl sm:text-2xl font-semibold bg-gradient-to-r ${profile.gradient} bg-clip-text text-transparent ml-4 self-center`}
                  >
                    {profile.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base flex-grow">
                  {profile.description}
                </p>
                
                {/* Animated button on hover */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`py-2 px-4 rounded-lg text-center text-white font-medium bg-gradient-to-r ${profile.gradient} transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300`}>
                    Learn More
                  </div>
                </div>
              </div>

              {/* Bottom Gradient Line */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r ${profile.gradient}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Social;