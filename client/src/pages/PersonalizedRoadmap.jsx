import React, { useState } from "react";

// Gemini API key (replace this with environment variable in production)
const GEMINI_API_KEY = "AIzaSyDm2ODVscz6kNEsHPo4yWlyyRMiGXWFLQA";

const PersonalizedRoadmap = () => {
  const [topic, setTopic] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [priorKnowledge, setPriorKnowledge] = useState("beginner");
  const [depth, setDepth] = useState("overview");
  const [roadmap, setRoadmap] = useState(null);
  const [step, setStep] = useState(1);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would integrate with your backend or API
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          timeLimit,
          priorKnowledge,
          depth,
        }),
      });

      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      console.error("Error generating roadmap:", err);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Render step content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Step 1: Choose Topic
            </h2>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                What topic would you like to learn?
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm p-3 
                           focus:border-primary-500 focus:ring focus:ring-primary-200"
                  placeholder="e.g., React, Machine Learning, Cloud Computing"
                />
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Step 2: Time Commitment
            </h2>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                How much time can you dedicate?
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm p-3 
                           focus:border-primary-500 focus:ring focus:ring-primary-200"
                >
                  <option value="">Select time commitment</option>
                  <option value="1-month">1 month</option>
                  <option value="3-months">3 months</option>
                  <option value="6-months">6 months</option>
                  <option value="1-year">1 year</option>
                </select>
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Step 3: Prior Knowledge
            </h2>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                What's your current level?
                <select
                  value={priorKnowledge}
                  onChange={(e) => setPriorKnowledge(e.target.value)}
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm p-3 
                           focus:border-primary-500 focus:ring focus:ring-primary-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Step 4: Learning Depth
            </h2>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                How much depth do you want to cover?
                <select
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm p-3 
                           focus:border-primary-500 focus:ring focus:ring-primary-200"
                >
                  <option value="overview">Overview (from the top)</option>
                  <option value="moderate">Moderate depth</option>
                  <option value="in-depth">In-depth understanding</option>
                </select>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        {!roadmap && step <= 4 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      step > num
                        ? "bg-primary-600 text-white"
                        : step === num
                        ? "bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {num}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {num === 1
                      ? "Topic"
                      : num === 2
                      ? "Time"
                      : num === 3
                      ? "Level"
                      : "Depth"}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(step - 1) * 33.3}%` }}
              />
            </div>
          </div>
        )}

        {/* Form or Roadmap Display */}
        {roadmap ? (
          <div className="card p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Learning Roadmap: {topic}
              </h1>
              <button
                onClick={() => setRoadmap(null)}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                Create New Roadmap
              </button>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-8">
                {/* Technologies and Topics */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Technologies and Topics
                  </h2>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
                    {roadmap.technologies}
                  </div>
                </div>

                {/* Step by Step Guide */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Step-by-Step Guide
                  </h2>
                  <div className="space-y-4">
                    {roadmap.steps.map((step, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                          Step {index + 1}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Resources */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Additional Resources
                  </h2>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
                    {roadmap.resources}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg
                             hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300"
                  >
                    Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto px-6 py-3 bg-primary-600 text-white rounded-lg 
                             hover:bg-primary-700 transition-all duration-300 shadow-lg 
                             hover:shadow-xl hover:shadow-primary-600/20"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-3 bg-primary-600 text-white rounded-lg 
                             hover:bg-primary-700 transition-all duration-300 shadow-lg 
                             hover:shadow-xl hover:shadow-primary-600/20"
                  >
                    Generate Roadmap
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedRoadmap;
