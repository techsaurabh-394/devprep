import React, { useState, useEffect, useRef } from 'react';

// Custom Icon Components (updated for LeetCode context)
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-blue-600">
    <path 
      fill="currentColor" 
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
    />
  </svg>
);

const ProblemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-green-600">
    <path 
      fill="currentColor" 
      d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"
    />
  </svg>
);

const AchievementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-yellow-600">
    <path 
      fill="currentColor" 
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

const ContestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-purple-600">
    <path 
      fill="currentColor" 
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
    />
  </svg>
);

const StudyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-red-600">
    <path 
      fill="currentColor" 
      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
    />
  </svg>
);

// YouTube Video Component (updated for LeetCode)
const YouTubeVideos = [
  { 
    title: "LeetCode Profile Optimization", 
    embedId: "xpIPfrItO_I", // Extracted from the iframe src
    description: "How to use LeetCode Effectively in 2024 to crack interviews easily || Effective use of LeetCode"
  },
  { 
    title: "Mastering Data Structures & Algorithms", 
    embedId: "8wysIxzqgPI",
    description: "My Brain after 569 Leetcode Problems"
  },
  { 
    title: "Acing Technical Interviews with LeetCode", 
    embedId: "0bHoB32fuj0",
    description: "Don't watch my A2Z DSA Course"
  }
];

// Enhanced AI Chatbot Component (updated prompts for LeetCode)
const LeetCodeChatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newChatHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newChatHistory);
    setUserMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDm2ODVscz6kNEsHPo4yWlyyRMiGXWFLQA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `Reformat your response to be clean, professional, and without markdown or asterisks. Use clear bullet points if listing steps. ${userMessage}` 
            }] 
          }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Clean up the response
      const cleanedResponse = aiResponse
        .replace(/\*+/g, '')  // Remove asterisks
        .replace(/^#+\s*/gm, '')  // Remove headers
        .trim();

      setChatHistory([...newChatHistory, { role: 'ai', content: cleanedResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory([
        ...newChatHistory, 
        { role: 'ai', content: 'Sorry, there was an error processing your request. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Allow sending message with Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Text-to-speech for AI responses
  const toggleSpeech = (text) => {
    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Start speaking
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false); // Reset state when speech ends
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-xl border border-blue-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center justify-between">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          LeetCode Profile AI Assistant
        </span>
        <button 
          onClick={() => {
            const lastAiMessage = chatHistory.filter(msg => msg.role === 'ai').pop();
            if (lastAiMessage) toggleSpeech(lastAiMessage.content);
          }}
          className={`flex items-center justify-center p-2 rounded-full transition-colors ${
            isSpeaking ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'
          }`}
          title={isSpeaking ? "Stop speaking" : "Read aloud"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </h2>

      {/* Added welcome message */}
      {chatHistory.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-blue-800">
          <p className="font-medium">Welcome to your LeetCode Profile Assistant!</p>
          <p className="text-sm mt-1">Ask me anything about improving your LeetCode profile, solving strategies, or technical interview preparation.</p>
        </div>
      )}
      
      <div 
        ref={chatContainerRef}
        className="h-64 overflow-y-auto mb-4 border border-blue-200 p-4 bg-white rounded-xl scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50"
      >
        {chatHistory.length > 0 ? (
          chatHistory.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white ml-auto shadow-sm' 
                  : 'bg-gray-100 border border-gray-200 text-gray-800 mr-auto shadow-sm'
              }`}
            >
              <div className="flex items-start">
                {msg.role === 'ai' && (
                  <div className="mr-2 mt-1 bg-blue-100 rounded-full p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className={msg.role === 'user' ? 'text-sm' : 'text-sm'}>{msg.content}</div>
                {msg.role === 'user' && (
                  <div className="ml-2 mt-1 bg-blue-800 rounded-full p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : null}
        {isLoading && (
          <div className="flex justify-center items-center my-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about LeetCode strategy and profile enhancement..."
          className="flex-grow p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
        <button 
          onClick={handleSendMessage} 
          disabled={isLoading || !userMessage.trim()}
          className={`text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2 ${
            isLoading || !userMessage.trim()
              ? 'bg-blue-300 cursor-not-allowed opacity-70' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow'
          }`}
        >
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      
      {/* Updated suggested questions for LeetCode */}
      <div className="mt-4">
        <p className="text-xs text-blue-700 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {["How to improve my problem-solving speed?", "Tips for dynamic programming", "How to prepare for contests"].map((question, idx) => (
            <button 
              key={idx}
              onClick={() => setUserMessage(question)}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-2 rounded-full border border-blue-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Tips Card Component
const TipCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center border border-gray-100 h-full transform hover:-translate-y-1">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Main LeetCode Enhancement Page Component
const LeetCodeEnhancementPage = () => {
  // Add navigation state for mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('tips');

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.111.744 1.715.744.603 0 1.186-.229 1.7-.744.514-.514.75-1.146.75-1.823s-.236-1.309-.749-1.823l-2.747-2.688c-1.337-1.336-3.159-2.072-5.497-2.072-2.322 0-4.161.736-5.498 2.073l-4.45 4.512c-1.336 1.337-2.072 3.159-2.072 5.498s.736 4.161 2.072 5.498l4.45 4.512c1.337 1.336 3.176 2.072 5.498 2.072 2.338 0 4.161-.736 5.498-2.072l2.747-2.688c.513-.513.749-1.146.749-1.823s-.236-1.309-.75-1.823c-.514-.514-1.096-.744-1.699-.744-.604 0-1.201.229-1.714.744z" />
                </svg>
                <span className="ml-2 font-bold text-gray-800">LeetCode Mastery</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-6">
                <button onClick={() => scrollToSection('tips')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'tips' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Enhancement Tips
                </button>
                <button onClick={() => scrollToSection('features')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'features' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Key Features
                </button>
                <button onClick={() => scrollToSection('videos')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'videos' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Videos
                </button>
                <button onClick={() => scrollToSection('assistant')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'assistant' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  AI Assistant
                </button>
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection('tips')} 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'tips' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              Enhancement Tips
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'features' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              Key Features
            </button>
            <button 
              onClick={() => scrollToSection('videos')} 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'videos' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              Videos
            </button>
            <button 
              onClick={() => scrollToSection('assistant')} 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'assistant' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              AI Assistant
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <div className="mx-auto bg-blue-600 text-white text-sm py-1 px-3 rounded-full inline-block mb-4">
            Boost Your Coding Skills
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            LeetCode Profile Mastery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your coding skills and unlock new career opportunities
          </p>
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => scrollToSection('assistant')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              Try AI Assistant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </header>

        {/* Enhancement Tips Section (updated for LeetCode) */}
        <section id="tips" className="mb-20 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              Enhancement Tips
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these proven strategies to make your LeetCode profile and skills stand out
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Profile Essentials
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Complete your profile with real name and professional photo.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Write a concise bio highlighting your programming background and goals.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connect your GitHub account to showcase your real-world coding projects.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Add your tech stack and programming languages to highlight your technical expertise.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Link your LinkedIn profile to build your professional network.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Problem-Solving Strategy
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Solve problems regularly to maintain a consistent activity graph.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Master problems across all difficulty levels, not just easy ones.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Contribute high-quality solutions to the discussion boards.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Focus on core patterns rather than memorizing specific problems.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Participate in weekly contests to boost your ranking.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="mb-20 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              Key Features
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how to make the most of LeetCode's powerful features
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TipCard 
              icon={<ProfileIcon />}
              title="Profile Optimization"
              description="Create a comprehensive profile that showcases your programming skills, experience, and achievements to stand out to potential employers."
            />
            <TipCard 
              icon={<ProblemIcon />}
              title="Problem Selection"
              description="Learn to strategically select problems based on your skill level, target company, and specific algorithm patterns to maximize your learning."
            />
            <TipCard 
              icon={<AchievementIcon />}
              title="Achievement Tracking"
              description="Track your progress and showcase your achievements through badges, streaks, and rankings to demonstrate your commitment."
            />
            <TipCard 
              icon={<ContestIcon />}
              title="Contest Participation"
              description="Participate in weekly contests to challenge yourself, compare your skills with others, and improve your global ranking."
            />
            <TipCard 
              icon={<StudyIcon />}
              title="Study Plans"
              description="Follow structured study plans designed to systematically build your skills from fundamental concepts to advanced algorithms."
            />
            <TipCard 
              icon={<ProblemIcon />}
              title="Solution Documentation"
              description="Document your solutions with clear explanations and time/space complexity analyses to demonstrate your analytical thinking."
            />
          </div>
        </section>

        {/* Videos Section */}
        <section id="videos" className="mb-20 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              Educational Videos
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch these videos to enhance your LeetCode skills and profile
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {YouTubeVideos.map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <iframe 
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Assistant Section */}
        <section id="assistant" className="scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              AI Assistant
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get personalized guidance to improve your LeetCode skills and profile
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <LeetCodeChatbot />
          </div>
        </section>
      </div>


    </div>
  );
};

export default LeetCodeEnhancementPage;