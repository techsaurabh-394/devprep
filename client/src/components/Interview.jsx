import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterviewService from "../services/interviewService";
import InterviewReport from "./InterviewReport";

const Interview = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const interviewServiceRef = useRef(null);
  const audioStreamRef = useRef(null);

  // UI state
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [audioMetrics, setAudioMetrics] = useState([]);
  const [error, setError] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);

  // Fetch questions from backend
  const startInterview = async () => {
    setLoadingQuestions(true);
    setError(null);
    try {
      const fetchedQuestions = await InterviewService.fetchQuestions(role);
      setQuestions(fetchedQuestions);
      setInterviewStarted(true);
      setCurrentQuestionIndex(0);
      setTimeLeft(60);
      setSessionTime(0);
      setUserAnswers([]);
      setAudioMetrics([]);
      setCurrentAnswer("");
    } catch (err) {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Timer for each question
  useEffect(() => {
    if (!interviewStarted || isEvaluating || showReport) return;
    if (timeLeft > 0 && isRecording) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRecording) {
      stopRecording();
    }
  }, [timeLeft, isRecording, interviewStarted, isEvaluating, showReport]);

  // Session timer
  useEffect(() => {
    if (!interviewStarted || isEvaluating || showReport) return;
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewStarted, isEvaluating, showReport]);

  // Microphone permission check
  useEffect(() => {
    if (!interviewStarted) return;
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setError(null);
      } catch (err) {
        setError("Microphone access is required. Please grant permission.");
      }
    };
    checkPermissions();
  }, [interviewStarted]);

  // Recording logic
  const startRecording = async () => {
    try {
      if (!interviewServiceRef.current) {
        interviewServiceRef.current = new InterviewService();
      }
      audioStreamRef.current = await interviewServiceRef.current.getAudioStream();
      await interviewServiceRef.current.startRecording(
        (transcript) => setCurrentAnswer(transcript),
        (error) => {
          setError("Failed to record audio. Please try again.");
          stopRecording();
        }
      );
      setIsRecording(true);
    } catch (error) {
      setError("Failed to start recording. Please check your microphone permissions.");
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
    if (currentAnswer.trim()) {
      const voiceMetrics = interviewServiceRef.current.analyzeVoiceMetrics(
        audioStreamRef.current ? audioStreamRef.current.getAudioLevel() : 128
      );
      handleAnswerSubmit(currentAnswer, voiceMetrics);
    }
  };

  // Handle answer submission and move to next question
  const handleAnswerSubmit = (answer, voiceMetrics) => {
    setUserAnswers((prev) => [...prev, answer]);
    setAudioMetrics((prev) => [...prev, voiceMetrics]);
    setCurrentAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(60);
    } else {
      handleInterviewComplete();
    }
  };

  // Evaluate all answers at the end
  const handleInterviewComplete = async () => {
    setIsEvaluating(true);
    try {
      const feedback = await InterviewService.evaluateAnswers({
        role,
        questions,
        answers: userAnswers,
        audioMetrics,
      });
      setFeedbackData({
        ...feedback,
        // fallback for missing fields
        strengths: feedback.overallEvaluation?.strengthsAndWeaknesses?.strengths || [],
        areasToImprove: feedback.overallEvaluation?.strengthsAndWeaknesses?.weaknesses || [],
        overallScore: feedback.overallEvaluation?.overallScore || 0,
        overallSummary: feedback.overallEvaluation?.summary || "",
        recommendations: feedback.overallEvaluation?.recommendations || "",
        questionAnalysis: (feedback.questionAnalysis || []).map((q, i) => ({
          ...q,
          question: questions[i],
          answer: userAnswers[i],
        })),
      });
      setShowReport(true);
    } catch (err) {
      setError("Failed to evaluate answers. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // UI rendering
  if (!interviewStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">{role} Interview</h1>
          <p className="text-lg text-gray-600 mb-8">
            Get ready for a real technical interview experience! You will have 1 minute per question. Click below to begin.
          </p>
          <button
            onClick={startInterview}
            disabled={loadingQuestions}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            {loadingQuestions ? "Loading..." : "Start Interview"}
          </button>
          {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
      </div>
    );
  }

  if (showReport && feedbackData) {
    return <InterviewReport feedbackData={feedbackData} onClose={() => navigate("/interview")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 md:mb-0">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Time Left:</span>
            <span className="text-2xl font-mono text-blue-600">{timeLeft}s</span>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {questions[currentQuestionIndex]}
          </h3>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 mb-4"
            rows={3}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer or use the mic..."
            disabled={isRecording || isEvaluating}
          />
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={startRecording}
              disabled={isRecording || isEvaluating}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isRecording ? (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>Start Recording</span>
                </>
              )}
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording || isEvaluating}
              className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span>Stop Recording</span>
            </button>
            <button
              onClick={() => handleAnswerSubmit(currentAnswer, { volume: 0.5, pace: "manual", clarity: "manual" })}
              disabled={isRecording || isEvaluating || !currentAnswer.trim()}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              Next Question
            </button>
          </div>
        </div>
        {isEvaluating && (
          <div className="flex items-center justify-center gap-2 text-gray-600 mt-4">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Evaluating your answers...</span>
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        <div className="mt-8 flex justify-between text-gray-500 text-sm">
          <div>Answered: {userAnswers.length} / {questions.length}</div>
          <div>Session Time: {Math.round(sessionTime / 60)} min</div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
