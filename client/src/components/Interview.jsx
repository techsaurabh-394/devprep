import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterviewService from "../services/interviewService";

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
  const { role } = useParams();
  const navigate = useNavigate();
  const interviewServiceRef = useRef(null);
  const audioStreamRef = useRef(null);

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [avgScore, setAvgScore] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState(null);

  // Cache for API responses
  const [cachedResponses, setCachedResponses] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Get questions for the selected role
  const currentQuestions = interviewQuestions[role] || [];

  // Initialize interview service
  useEffect(() => {
    try {
      interviewServiceRef.current = new InterviewService();
    } catch (err) {
      setError("Speech recognition is not supported in your browser");
      console.error("Failed to initialize interview service:", err);
    }
  }, []);

  // Check microphone permission
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setError(null);
      } catch (err) {
        setError("Microphone access is required. Please grant permission.");
        console.error("Failed to get microphone permission:", err);
      }
    };
    checkPermissions();
  }, []);

  const startRecording = async () => {
    try {
      if (!interviewServiceRef.current) {
        throw new Error("Interview service not initialized");
      }

      // Start audio stream for visualization
      audioStreamRef.current =
        await interviewServiceRef.current.getAudioStream();

      // Start speech recognition
      await interviewServiceRef.current.startRecording(
        (transcript) => {
          setCurrentAnswer(transcript);
          // Analyze audio level
          const level = audioStreamRef.current.getAudioLevel();
          setAudioLevel(level);
        },
        (error) => {
          console.error("Speech recognition error:", error);
          setError("Failed to record audio. Please try again.");
          stopRecording();
        }
      );

      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setError(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (interviewServiceRef.current) {
      interviewServiceRef.current.stopRecording();
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.stopStream();
    }

    setIsRecording(false);

    // Save the answer and proceed
    if (currentAnswer.trim()) {
      const voiceMetrics =
        interviewServiceRef.current.analyzeVoiceMetrics(audioLevel);
      handleAnswerSubmit(currentAnswer, voiceMetrics);
    }
  };

  // Update answer and progress with caching
  const handleAnswerSubmit = async (answer, voiceMetrics) => {
    try {
      setIsEvaluating(true);
      const currentQuestion = currentQuestions[currentQuestionIndex];
      const cacheKey = `${role}:${currentQuestion}:${answer}`;

      let score, feedback;

      // Check cache first
      if (cachedResponses[cacheKey]) {
        ({ score, feedback } = cachedResponses[cacheKey]);
      } else {
        // Make API call if not in cache
        try {
          const response = await fetch("/api/interview/evaluate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              role,
              question: currentQuestion,
              answer,
              voiceMetrics,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to evaluate answer");
          }

          ({ score, feedback } = await response.json());

          // Cache the response
          setCachedResponses((prev) => ({
            ...prev,
            [cacheKey]: { score, feedback },
          }));
        } catch (err) {
          console.error("API Error:", err);
          // Fallback scoring if API fails
          score = 5; // Default middle score
          feedback =
            "Unable to evaluate answer due to technical issues. Please continue with the interview.";
        }
      }

      // Store answer with feedback
      setUserAnswers((prev) => [
        ...prev,
        {
          answer,
          voiceMetrics,
          score,
          feedback,
          question: currentQuestion,
        },
      ]);

      setAvgScore((prev) => prev + score);

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(60);
        setCurrentAnswer("");
      } else {
        handleInterviewComplete();
      }
    } catch (err) {
      console.error("Failed to process answer:", err);
      setError("Failed to process your answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleInterviewComplete = () => {
    // Navigate to results page with complete interview data
    navigate("/interview/results", {
      state: {
        answers: userAnswers,
        duration: sessionTime,
        averageScore: avgScore / userAnswers.length,
      },
    });
  };

  // Timer effects
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && isRecording) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRecording) {
      stopRecording();
    }
  }, [timeLeft, isRecording, stopRecording]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Interview Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {role} Interview
            </h1>
            <div className="flex items-center justify-between text-gray-600">
              <span>
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
              <span>Time Left: {timeLeft}s</span>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Current Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {currentQuestions[currentQuestionIndex]}
            </h2>

            {/* Interview Controls */}
            <div className="space-y-6">
              {isEvaluating && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Evaluating your answer...</span>
                </div>
              )}

              {currentAnswer && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Your Answer
                  </h4>
                  <p className="text-gray-800">{currentAnswer}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  {isRecording ? (
                    <>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                      <span>Start Recording</span>
                    </>
                  )}
                </button>
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                  <span>Stop Recording</span>
                </button>
              </div>

              {/* Audio Level Visualization */}
              {isRecording && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Audio Level</span>
                    <span>{Math.round((audioLevel / 255) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-100"
                      style={{ width: `${(audioLevel / 255) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {userAnswers.length}
                </div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {userAnswers.length > 0
                    ? Math.round((avgScore / userAnswers.length) * 100) + "%"
                    : "0%"}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(sessionTime / 60)}
                </div>
                <div className="text-sm text-gray-600">Minutes Practiced</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
