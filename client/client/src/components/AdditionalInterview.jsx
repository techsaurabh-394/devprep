import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import InterviewReport from "./InterviewReport";

const InterviewPrep = () => {
  const [stage, setStage] = useState("job-input");
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(15);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [aiEvaluation, setAiEvaluation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [questionAnalysis, setQuestionAnalysis] = useState([]);
  const videoRef = useRef(null);
  const [recognition, setRecognition] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyDm2ODVscz6kNEsHPo4yWlyyRMiGXWFLQA"
  );

  useEffect(() => {
    let mounted = true;
    let audioContext = null;
    let analyser = null;

    const initializeMediaDevices = async () => {
      try {
        // Request both audio and video permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        // Set up webcam
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setMediaStream(stream);

        // Set up audio context and analyser
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;

        // Set up speech recognition
        if ("webkitSpeechRecognition" in window) {
          const recognitionInstance = new window.webkitSpeechRecognition();
          recognitionInstance.continuous = true;
          recognitionInstance.interimResults = true;
          recognitionInstance.lang = "en-US";

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateAudioLevel = () => {
            if (isRecording && mounted) {
              analyser.getByteFrequencyData(dataArray);
              const average =
                dataArray.reduce((a, b) => a + b) / dataArray.length;
              setAudioLevel(average);
              requestAnimationFrame(updateAudioLevel);
            }
          };

          recognitionInstance.onstart = () => {
            updateAudioLevel();
          };

          recognitionInstance.onresult = (event) => {
            if (mounted) {
              const interimTranscript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");
              setUserAnswer(interimTranscript);
            }
          };

          recognitionInstance.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            if (mounted) {
              setIsRecording(false);
              setAudioLevel(0);
              alert(
                `Speech recognition error: ${event.error}. Please try again.`
              );
            }
          };

          recognitionInstance.onend = () => {
            if (mounted) {
              setIsRecording(false);
            }
          };

          setRecognition(recognitionInstance);
        } else {
          throw new Error("Speech recognition not supported");
        }
      } catch (err) {
        console.error("Media initialization error:", err);
        if (mounted) {
          let errorMessage = "Failed to initialize media devices. ";
          if (err.name === "NotAllowedError") {
            errorMessage += "Please grant microphone and camera permissions.";
          } else if (err.name === "NotFoundError") {
            errorMessage += "No microphone or camera found.";
          } else {
            errorMessage += "Please check your device settings.";
          }
          alert(errorMessage);
        }
      }
    };

    initializeMediaDevices();

    // Cleanup function
    return () => {
      mounted = false;
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isRecording, mediaStream, recognition]); // Update the dependency array

  const generateInterviewQuestions = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Generate ${questionCount} simple interview questions for a ${jobRole} position based on the following job description:

${jobDescription}

For each question, provide:
1. A clear, specific question that tests technical and soft skills
2. The question should be relevant to the job requirements
3. Include a mix of behavioral, technical, and situational questions
4. Ensure questions are professional and job-specific

Format the output as a JSON array of question objects, where each object has a "question" property.`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        try {
          const questions = JSON.parse(jsonMatch[0]);
          setGeneratedQuestions(questions);
          setStage("interview");
        } catch (parseError) {
          console.error("Failed to parse questions:", parseError);
          alert("Failed to generate questions. Please try again.");
        }
      } else {
        console.error("No JSON found in response");
        alert("Failed to generate questions. Please try again.");
      }
    } catch (error) {
      console.error("Question Generation Error:", error);
      alert(
        "Failed to generate questions. Please check your API key and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Webcam access error:", error);
      alert("Unable to access webcam. Please check permissions.");
    }
  };

  const startRecording = async () => {
    try {
      if (!recognition) {
        throw new Error("Speech recognition not initialized");
      }

      if (!mediaStream) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      }

      recognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      let errorMessage = "Failed to start recording. ";
      if (error.name === "NotAllowedError") {
        errorMessage += "Please grant microphone and camera permissions.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No microphone or camera found.";
      } else {
        errorMessage += error.message;
      }
      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const evaluateAnswer = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const currentQuestion = generatedQuestions[currentQuestionIndex].question;

      const prompt = `Evaluate this answer to the interview question: "${currentQuestion}"

Answer: "${userAnswer}"

Please provide a comprehensive evaluation in JSON format with the following structure:
{
  "score": number (0-10),
  "feedback": "detailed analysis of the answer",
  "improvements": "specific suggestions for improvement",
  "keyPoints": ["array of key points covered"],
  "missingPoints": ["array of important points that were missed"],
  "confidence": number (0-10),
  "clarity": number (0-10),
  "technicalAccuracy": number (0-10)
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const jsonMatch = response.match(/{[\s\S]*}/);

      if (jsonMatch) {
        const evaluation = JSON.parse(jsonMatch[0]);
        setQuestionAnalysis((prev) => [
          ...prev,
          {
            question: currentQuestion,
            answer: userAnswer,
            ...evaluation,
          },
        ]);

        // Format the evaluation for display
        const displayEvaluation = `**Score:** ${evaluation.score}/10
**Analysis:** ${evaluation.feedback}
**Areas to Improve:** ${evaluation.improvements}
**Key Points Covered:**
${evaluation.keyPoints.map((point) => `• ${point}`).join("\n")}
**Technical Accuracy:** ${evaluation.technicalAccuracy}/10
**Clarity:** ${evaluation.clarity}/10
**Confidence Level:** ${evaluation.confidence}/10`;

        setAiEvaluation(displayEvaluation);
      } else {
        throw new Error("Failed to parse evaluation response");
      }
    } catch (error) {
      console.error("AI Evaluation Error:", error);
      setAiEvaluation(
        "Evaluation failed. Please try again or check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateOverallFeedback = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Provide an overall evaluation of the interview performance for a ${jobRole} position.

Questions and Answers with Analysis:
${questionAnalysis
  .map(
    (qa, index) =>
      `Question ${index + 1}: ${qa.question}
   Answer: ${qa.answer}
   Score: ${qa.score}/10
   Analysis: ${qa.feedback}`
  )
  .join("\n\n")}

Please provide a comprehensive evaluation in JSON format with the following structure:
{
  "overallScore": number (0-100),
  "overallSummary": "detailed summary of performance",
  "strengths": ["array of key strengths demonstrated"],
  "areasToImprove": ["array of areas needing improvement"],
  "recommendations": "detailed recommendations for improvement",
  "performanceByCategory": {
    "technicalKnowledge": number (0-100),
    "communication": number (0-100),
    "problemSolving": number (0-100),
    "professionalDemeanor": number (0-100)
  }
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const jsonMatch = response.match(/{[\s\S]*}/);

      if (jsonMatch) {
        const overallEvaluation = JSON.parse(jsonMatch[0]);
        const feedback = {
          ...overallEvaluation,
          questionAnalysis: questionAnalysis,
        };

        setFeedbackData(feedback);
        setShowReport(true);
        setStage("overall-feedback");
      } else {
        throw new Error("Failed to parse overall evaluation response");
      }
    } catch (error) {
      console.error("Overall Feedback Generation Error:", error);
      alert("Failed to generate overall feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stage === "interview") {
      startWebcam();
    }
  }, [stage]);

  const renderJobInput = () => (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">
        Custom Interview Preparation
      </h1>

      <div className="w-full max-w-2xl bg-purple-50 p-8 rounded-lg shadow-2xl">
        <div className="mb-4">
          <label className="block text-purple-800 mb-2 font-semibold">
            Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g., Software Engineer, Data Scientist"
            className="w-full p-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-purple-800 mb-2 font-semibold">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows="6"
            className="w-full p-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-purple-800 mb-2 font-semibold">
            Number of Questions
          </label>
          <div className="flex space-x-4">
            {[5, 10, 15, 20].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-4 py-2 rounded-full transition-all ${
                  questionCount === count
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateInterviewQuestions}
          disabled={!jobRole || !jobDescription || isLoading}
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Questions...
            </span>
          ) : (
            "Generate Interview Questions"
          )}
        </button>
      </div>
    </div>
  );

  const renderInterviewStage = () => (
    <div className="bg-white min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-6xl grid grid-cols-12 gap-8">
        <div className="col-span-6 bg-purple-100 rounded-lg overflow-hidden h-[600px] shadow-xl relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                mediaStream ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              {mediaStream ? "Camera Connected" : "No Camera"}
            </span>
          </div>
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm">Recording</span>
            </div>
          )}
        </div>

        <div className="col-span-6 bg-purple-50 rounded-lg p-6 flex flex-col shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800">
              {jobRole} Interview
            </h2>
            <span className="text-purple-700">
              Question {currentQuestionIndex + 1} of {questionCount}
            </span>
          </div>

          <div className="mb-6 flex-grow">
            <p className="text-lg text-purple-900 mb-4">
              {generatedQuestions[currentQuestionIndex].question}
            </p>

            {isRecording && (
              <div className="bg-purple-100 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-800 font-semibold">
                    Audio Level
                  </span>
                  <span className="text-purple-600">
                    {Math.round(audioLevel)}%
                  </span>
                </div>
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-100"
                    style={{ width: `${Math.min(100, audioLevel)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
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

          {userAnswer && (
            <div className="bg-purple-100 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2 text-purple-800">Your Answer:</h3>
              <p className="text-purple-900">{userAnswer}</p>
            </div>
          )}

          {aiEvaluation && (
            <div className="bg-purple-100 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2 text-purple-800">AI Evaluation:</h3>
              <div className="text-purple-900 whitespace-pre-line">
                {aiEvaluation.split("\n").map((line, index) => {
                  if (line.startsWith("**")) {
                    return (
                      <p key={index} className="font-bold">
                        {line.replace(/\*\*/g, "")}
                      </p>
                    );
                  }
                  return <p key={index}>{line.replace(/\*/g, "•")}</p>;
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-auto gap-2">
            <button
              onClick={evaluateAnswer}
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Evaluating...
                </span>
              ) : (
                "Evaluate Answer"
              )}
            </button>

            {currentQuestionIndex > 0 && (
              <button
                onClick={() => {
                  setCurrentQuestionIndex((prev) => prev - 1);
                  setUserAnswer(userAnswers[currentQuestionIndex - 1] || "");
                  setAiEvaluation("");
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Previous Question
              </button>
            )}

            {currentQuestionIndex < questionCount - 1 ? (
              <button
                onClick={() => {
                  setUserAnswers((prev) => [...prev, userAnswer]);
                  setCurrentQuestionIndex((prev) => prev + 1);
                  setUserAnswer("");
                  setAiEvaluation("");
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={generateOverallFeedback}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Feedback...
                  </span>
                ) : (
                  "Generate Overall Feedback"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverallFeedback = () => (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">
        Interview Complete
      </h1>

      <div className="w-full max-w-2xl bg-purple-50 p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">
          Interview Analysis Complete
        </h2>
        <p className="text-purple-700 mb-6">
          Your interview responses have been analyzed. Click below to view your
          detailed report.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setShowReport(true)}
            className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Detailed Report
          </button>
          <button
            onClick={() => setStage("job-input")}
            className="bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>

      {showReport && feedbackData && (
        <InterviewReport
          feedbackData={feedbackData}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );

  return (
    <div>
      {stage === "job-input" && renderJobInput()}
      {stage === "interview" && renderInterviewStage()}
      {stage === "overall-feedback" && renderOverallFeedback()}
    </div>
  );
};

export default InterviewPrep;
