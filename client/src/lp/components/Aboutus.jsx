import React from "react";

const AboutUs = () => {
  return (
    <div
      id="about%20us"
      className="relative bg-white text-gray-800 py-32 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at center, black 1px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* About Section */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            About DevPrep
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-12"></div>

          <div className="max-w-4xl mx-auto backdrop-blur-lg bg-black/5 p-8 rounded-2xl border border-black/5">
            <h3 className="text-2xl font-bold mb-6 text-blue-400">
              What we provide
            </h3>
            <p className="mb-6 text-gray-600 leading-relaxed">
              DevPrep is a cutting-edge platform designed to empower individuals
              at any stage of their tech journey. Whether you're just starting
              out, a first-year college student, or a recent high school
              graduate, we provide personalized roadmaps and rich resources to
              guide you through in-demand technology streams like Web
              Development, App Development, Web3, DevOps, Data Science, and
              AI/ML. Our tailored approach ensures you master essential skills
              while staying focused on your career goals.
            </p>
            <p className="text-gray-600 leading-relaxed hidden md:block">
              But we don't stop there. DevPrep goes beyond just learning—our
              platform offers AI-powered analytics to help you prepare for
              interviews and optimize your coding performance. We help you craft
              an impressive resume, enhance your portfolio, and connect with
              real-world opportunities. With access to a supportive community
              through Discord, Telegram, and social media channels, you'll stay
              connected with industry trends, hackathons, open-source projects,
              and internships that will fast-track your career growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
