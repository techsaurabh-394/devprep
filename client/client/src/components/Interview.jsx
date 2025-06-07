import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCode, FaProjectDiagram, FaUserTie } from "react-icons/fa";

// Interview questions for different roles (unchanged)
const interviewQuestions = {
  "SDE-1": [
    "Tell me about yourself.",
    "Why do you want to be a software developer?",
    "How would you solve this algorithmic problem?",
    "What are your strengths and weaknesses?",
    "Explain a time when you had to debug a challenging issue.",
    "What is OOP and why is it important?",
    "What are your thoughts on Agile development?",
  ],
  "SDE-2": [
    "Tell me about a complex project you've worked on.",
    "How do you handle code reviews?",
    "What design patterns have you used?",
    "Describe a challenging problem you solved and how you approached it.",
    "What is your experience with system design?",
    "How do you prioritize tasks in a project?",
  ],
  "SDE-3": [
    "Describe your leadership experience.",
    "How do you mentor junior developers?",
    "What’s your approach to handling high-pressure situations?",
    "How do you ensure code quality in your team?",
    "What’s your experience with cloud technologies?",
    "How do you keep up with new technologies?",
  ],
  "Data Analyst": [
    "Tell me about yourself.",
    "How would you analyze a dataset with missing values?",
    "What are the most important skills for a data analyst?",
    "Can you explain the difference between mean, median, and mode?",
    "What is the process of ETL?",
    "Have you used SQL for data analysis? Give an example.",
    "How do you visualize data effectively?",
  ],
  "Cybersecurity Engineer": [
    "Tell me about yourself.",
    "What is the difference between symmetric and asymmetric encryption?",
    "Explain how a man-in-the-middle attack works.",
    "How would you secure a network from external threats?",
    "What is a firewall and how does it work?",
    "What is penetration testing?",
    "How would you handle a security breach?",
  ],
  "DevOps Engineer": [
    "Tell me about yourself.",
    "What is CI/CD and how do you implement it?",
    "Explain the concept of containerization.",
    "What tools have you used for automation?",
    "How do you monitor a production system?",
    "What is infrastructure as code?",
    "What is the most challenging part of working with DevOps?",
  ],
  "UI/UX Designer": [
    "Tell me about yourself.",
    "What is your design process?",
    "How do you balance user needs with business goals?",
    "Explain how you conduct user testing.",
    "How would you improve the user interface of a product?",
    "What tools do you use for wireframing and prototyping?",
    "Can you explain the difference between UI and UX?",
  ],
  "Cloud Engineer": [
    "Tell me about yourself.",
    "What is cloud computing?",
    "What are the differences between IaaS, PaaS, and SaaS?",
    "What is your experience with cloud providers like AWS, Azure, or Google Cloud?",
    "How do you ensure high availability and disaster recovery in a cloud environment?",
    "What are containers and how do they relate to cloud infrastructure?",
    "How do you manage cloud cost optimization?",
  ],
  "Data Scientist": [
    "Tell me about yourself.",
    "What is the difference between supervised and unsupervised learning?",
    "How do you handle missing data in a dataset?",
    "Explain a time when you built a predictive model. What algorithm did you use?",
    "What is the importance of feature engineering?",
    "How do you ensure the accuracy of a machine learning model?",
    "Explain the bias-variance tradeoff.",
  ],
  "QA Engineer": [
    "Tell me about yourself.",
    "What is the difference between manual and automated testing?",
    "How do you approach writing test cases?",
    "What is regression testing and why is it important?",
    "What tools have you used for automated testing?",
    "How do you ensure that a product is bug-free?",
    "Can you explain the concept of continuous testing in a CI/CD pipeline?",
  ],
  "Machine Learning Engineer": [
    "Tell me about yourself.",
    "What is the difference between a machine learning model and an algorithm?",
    "What are some common algorithms used in machine learning?",
    "Explain a time when you worked on training a model. What data and techniques did you use?",
    "What is the importance of data preprocessing in machine learning?",
    "How do you evaluate the performance of a machine learning model?",
    "What is overfitting and how do you prevent it?",
  ],
  "Full Stack Developer": [
    "Tell me about yourself.",
    "What technologies do you use in both front-end and back-end development?",
    "Explain how you handle API development and integration.",
    "What is the MVC architecture and how do you implement it?",
    "How do you ensure the scalability of a full stack application?",
    "What are the best practices for version control in full-stack development?",
    "How do you handle authentication and authorization in your applications?",
  ],
};

const Interview = () => {
  const { role } = useParams(); // Get role from URL parameters

  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [videoStream, setVideoStream] = useState(null);
  const [sessionTime, setSessionTime] = useState(0); // Total interview time
  const [timeLeft, setTimeLeft] = useState(60); // Timer per question
  const [notes, setNotes] = useState(""); // Speech-to-text notes
  const [recognizedSpeech, setRecognizedSpeech] = useState(""); // Separate state for speech-to-text
  const [recognition, setRecognition] = useState(null); // Store SpeechRecognition instance
  const [selectedLanguage, setSelectedLanguage] = useState("en-US"); // Default language set to English
  const [activeLanguage, setActiveLanguage] = useState("en-US"); // Track the active language for button color

  // Get questions for the selected role
  const currentQuestions = interviewQuestions[role] || []; // Fallback to empty array if no questions found for the role

  // Initialize the SpeechRecognition API
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognitionAPI();
      recog.continuous = true; // Keep listening until stopped
      recog.interimResults = true; // Capture results as user speaks
      recog.lang = selectedLanguage; // Set language dynamically

      // Set up event listeners for speech recognition
      recog.onresult = (event) => {
        // Get the transcript from the latest result
        const transcript =
          event.results[event.results.length - 1][0].transcript;

        // Update recognized speech (separate from notes)
        setRecognizedSpeech((prevSpeech) => prevSpeech + " " + transcript);
      };

      recog.onerror = (event) => {
        console.error("Speech Recognition Error: ", event.error);
      };

      setRecognition(recog); // Save the recognition instance
    } else {
      alert("Speech Recognition API is not supported in your browser.");
    }
  }, [selectedLanguage]); // Reinitialize when language is changed

  // Reset recognized speech when question changes
  useEffect(() => {
    setRecognizedSpeech("");
  }, [currentQuestionIndex]); // Reset speech when the question index changes

  // Start webcam and microphone, also start speech recognition
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoStream(stream);
      setIsWebcamOn(true);

      // Start speech recognition once the webcam is on
      if (recognition) {
        recognition.start();
        console.log("Speech recognition started");
      }
    } catch (err) {
      console.error("Error accessing webcam/mic", err);
      alert("Failed to access webcam and mic.");
    }
  };

  // Stop webcam and microphone, also stop speech recognition
  const stopWebcam = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
    setIsWebcamOn(false);

    // Stop speech recognition when the webcam is turned off
    if (recognition) {
      recognition.stop();
      console.log("Speech recognition stopped");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60); // Reset timer for next question
    }
  };

  const handleSubmit = () => {
    alert(`Interview submitted! Notes: ${notes}`);
    stopWebcam();
  };

  // Get the current question
  const currentQuestion =
    currentQuestions[currentQuestionIndex] ||
    "No questions available for this role.";

  useEffect(() => {
    if (isWebcamOn) {
      const sessionTimer = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(sessionTimer);
    }
  }, [isWebcamOn]);

  useEffect(() => {
    if (timeLeft > 0) {
      const questionTimer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(questionTimer);
    }
  }, [timeLeft]);

  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setActiveLanguage(language); // Set the active language for button color
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Interview Practice
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice with AI-powered mock interviews tailored to your experience
            level and role.
          </p>
        </div>

        {/* Interview Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Coding Interview */}
          <div className="card card-hover p-8">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-6">
              <FaCode className="text-4xl text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Coding Interview
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Practice algorithmic problem-solving and data structures with
              real-time feedback.
            </p>
            <button
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg 
                             hover:bg-primary-700 transition-all duration-300 shadow-lg 
                             hover:shadow-xl hover:shadow-primary-600/20"
            >
              Start Practice
            </button>
          </div>

          {/* System Design */}
          <div className="card card-hover p-8">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-6">
              <FaProjectDiagram className="text-4xl text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              System Design
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Learn to design scalable systems and discuss architectural
              decisions.
            </p>
            <button
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg 
                             hover:bg-primary-700 transition-all duration-300 shadow-lg 
                             hover:shadow-xl hover:shadow-primary-600/20"
            >
              Start Practice
            </button>
          </div>

          {/* Behavioral Interview */}
          <div className="card card-hover p-8">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mb-6">
              <FaUserTie className="text-4xl text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Behavioral Interview
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Perfect your responses to common behavioral questions with AI
              feedback.
            </p>
            <button
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg 
                             hover:bg-primary-700 transition-all duration-300 shadow-lg 
                             hover:shadow-xl hover:shadow-primary-600/20"
            >
              Start Practice
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-16">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  12
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Interviews Completed
                </div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  85%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Average Score
                </div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  8
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Hours Practiced
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
