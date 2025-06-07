import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const InterviewPrep = () => {
  const [stage, setStage] = useState('job-input');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState('');
  const [overallFeedback, setOverallFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const [recognition, setRecognition] = useState(null);


  const genAI = new GoogleGenerativeAI('AIzaSyDm2ODVscz6kNEsHPo4yWlyyRMiGXWFLQA');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const interimTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setUserAnswer(interimTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition not supported');
      alert('Speech recognition is not supported in this browser.');
    }
  }, []);

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
          setStage('interview');
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
      alert("Failed to generate questions. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Webcam access error:", error);
      alert("Unable to access webcam. Please check permissions.");
    }
  };

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const evaluateAnswer = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const currentQuestion = generatedQuestions[currentQuestionIndex].question;
      
      const prompt = `Evaluate this answer to the interview question: "${currentQuestion}"

Answer: "${userAnswer}"

Please provide a comprehensive evaluation with:
1. Relevance Score (0-10)
2. Proper correct answer
3. Keep the answer short (50-60 words)
4. Suggested Improvements

Format your response in a clear, constructive manner that helps the interviewee understand their performance. Use bold text for headings (e.g., **Key Strengths Demonstrated:**) and ensure the response is well-formatted in points. Do not use * marks.`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      setAiEvaluation(response);
    } catch (error) {
      console.error("AI Evaluation Error:", error);
      setAiEvaluation("Evaluation failed. Please try again or check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateOverallFeedback = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `Provide an overall evaluation of the interview performance for a ${jobRole} position.

Questions and Answers:
${generatedQuestions.map((q, index) => 
  `Question ${index + 1}: ${q.question}\nAnswer: ${userAnswers[index]}`
).join('\n\n')}

Please provide:
1. A concise overall performance summary
2. Key strengths demonstrated
3. Areas for improvement
4. Overall recommendation

Format the response with bold headings (e.g., **Key Strengths Demonstrated:**) and ensure it is well-formatted in points. Do not use * marks.`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      setOverallFeedback(response);
      setStage('overall-feedback');
    } catch (error) {
      console.error("Overall Feedback Generation Error:", error);
      alert("Failed to generate overall feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stage === 'interview') {
      startWebcam();
    }
  }, [stage]);

  const renderJobInput = () => (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">Custom Interview Preparation</h1>
      
      <div className="w-full max-w-2xl bg-purple-50 p-8 rounded-lg shadow-2xl">
        <div className="mb-4">
          <label className="block text-purple-800 mb-2 font-semibold">Job Role</label>
          <input 
            type="text" 
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g., Software Engineer, Data Scientist"
            className="w-full p-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 transition-colors"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-purple-800 mb-2 font-semibold">Job Description</label>
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows="6"
            className="w-full p-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-purple-800 mb-2 font-semibold">Number of Questions</label>
          <div className="flex space-x-4">
            {[5, 10, 15, 20].map(count => (
              <button 
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-4 py-2 rounded-full transition-all ${
                  questionCount === count 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
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
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Questions...
            </span>
          ) : (
            'Generate Interview Questions'
          )}
        </button>
      </div>
    </div>
  );

  const renderInterviewStage = () => (
    <div className="bg-white min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-6xl grid grid-cols-12 gap-8">

        <div className="col-span-6 bg-purple-100 rounded-lg overflow-hidden h-[600px] shadow-xl">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="col-span-6 bg-purple-50 rounded-lg p-6 flex flex-col shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">
            {jobRole} Interview
          </h2>

          <div className="mb-6 flex-grow">
            <p className="text-lg text-purple-900">
              {generatedQuestions[currentQuestionIndex].question}
            </p>
          </div>

          <div className="flex space-x-4 mb-6">
            <button 
              onClick={startRecording}
              disabled={isRecording}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            <button 
              onClick={stopRecording}
              disabled={!isRecording}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              Stop Recording
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
                {aiEvaluation.split('\n').map((line, index) => {
                  if (line.startsWith('**')) {
                    return <p key={index} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
                  }
                  return <p key={index}>{line.replace(/\*/g, '•')}</p>;
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
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Evaluating...
                </span>
              ) : (
                'Evaluate Answer'
              )}
            </button>
            
            {currentQuestionIndex > 0 && (
              <button 
                onClick={() => {
                  setCurrentQuestionIndex(prev => prev - 1);
                  setUserAnswer(userAnswers[currentQuestionIndex - 1] || '');
                  setAiEvaluation('');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Previous Question
              </button>
            )}

            {currentQuestionIndex < questionCount - 1 ? (
              <button 
                onClick={() => {
                  setUserAnswers(prev => [...prev, userAnswer]);
                  setCurrentQuestionIndex(prev => prev + 1);
                  setUserAnswer('');
                  setAiEvaluation('');
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
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Feedback...
                  </span>
                ) : (
                  'Generate Overall Feedback'
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
      <h1 className="text-4xl font-bold text-purple-600 mb-8">Interview Feedback</h1>
      
      <div className="w-full max-w-2xl bg-purple-50 p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">Overall Feedback</h2>
        <div className="bg-purple-100 p-4 rounded-lg">
          <div className="text-purple-900 whitespace-pre-line">
            {overallFeedback.split('\n').map((line, index) => {
              if (line.startsWith('**')) {
                return <p key={index} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
              }
              return <p key={index}>{line.replace(/\*/g, '•')}</p>;
            })}
          </div>
        </div>

        <button 
          onClick={() => setStage('job-input')}
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 mt-6 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {stage === 'job-input' && renderJobInput()}
      {stage === 'interview' && renderInterviewStage()}
      {stage === 'overall-feedback' && renderOverallFeedback()}
    </div>
  );
};

export default InterviewPrep;