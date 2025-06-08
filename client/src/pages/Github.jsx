import React, { useState, useEffect, useRef } from 'react';

// Custom Icon Components (changed to GitHub theme)
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-green-600">
    <path 
      fill="currentColor" 
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
    />
  </svg>
);

const HeadlineIcon = () => (
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

const NetworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-purple-600">
    <path 
      fill="currentColor" 
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
    />
  </svg>
);

const ContentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-red-600">
    <path 
      fill="currentColor" 
      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
    />
  </svg>
);

// YouTube Video Component (changed to GitHub related videos)
const YouTubeVideos = [
  { 
    title: "GitHub Profile Optimization", 
    embedId: "n6d4KHSKqGk", 
    description: "Learn how to create a stunning GitHub profile to showcase your coding skills and projects."
  },
  { 
    title: "Open Source Contribution Strategies", 
    embedId: "yzeVMecydCE",
    description: "How to start contributing to open source projects on GitHub from scratch"
  },
  { 
    title: "GitHub Portfolio for Developers", 
    embedId: "G-EGDH50hGE",
    description: "Create an impressive GitHub portfolio to land your dream developer job"
  }
];

// Enhanced AI Chatbot Component (changed to GitHub focus)
const GitHubChatbot = () => {
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
      utterance.onend = () => setIsSpeaking(false); 
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-xl border border-green-200">
      <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center justify-between">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          GitHub Profile AI Assistant
        </span>
        <button 
          onClick={() => {
            const lastAiMessage = chatHistory.filter(msg => msg.role === 'ai').pop();
            if (lastAiMessage) toggleSpeech(lastAiMessage.content);
          }}
          className={`flex items-center justify-center p-2 rounded-full transition-colors ${
            isSpeaking ? 'bg-green-600 text-white' : 'text-green-600 hover:bg-green-100'
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-green-800">
          <p className="font-medium">Welcome to your GitHub Profile Assistant!</p>
          <p className="text-sm mt-1">Ask me anything about improving your GitHub profile, contributing to open source, or building your developer portfolio.</p>
        </div>
      )}
      
      <div 
        ref={chatContainerRef}
        className="h-64 overflow-y-auto mb-4 border border-green-200 p-4 bg-white rounded-xl scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50"
      >
        {chatHistory.length > 0 ? (
          chatHistory.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-green-600 text-white ml-auto shadow-sm' 
                  : 'bg-gray-100 border border-gray-200 text-gray-800 mr-auto shadow-sm'
              }`}
            >
              <div className="flex items-start">
                {msg.role === 'ai' && (
                  <div className="mr-2 mt-1 bg-green-100 rounded-full p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className={msg.role === 'user' ? 'text-sm' : 'text-sm'}>{msg.content}</div>
                {msg.role === 'user' && (
                  <div className="ml-2 mt-1 bg-green-800 rounded-full p-1 flex-shrink-0">
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
              <div className="w-3 h-3 rounded-full bg-green-600 animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
          placeholder="Ask about GitHub profile enhancement..."
          className="flex-grow p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all"
        />
        <button 
          onClick={handleSendMessage} 
          disabled={isLoading || !userMessage.trim()}
          className={`text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2 ${
            isLoading || !userMessage.trim()
              ? 'bg-green-300 cursor-not-allowed opacity-70' 
              : 'bg-green-600 hover:bg-green-700 shadow-sm hover:shadow'
          }`}
        >
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      
      {/* Added suggested questions */}
      <div className="mt-4">
        <p className="text-xs text-green-700 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {["How do I write a good README?", "Tips for GitHub profile picture", "How to showcase projects"].map((question, idx) => (
            <button 
              key={idx}
              onClick={() => setUserMessage(question)}
              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 py-1 px-2 rounded-full border border-green-200 transition-colors"
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

// Main GitHub Enhancement Page Component (enhanced)
const GitHubEnhancementPage = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="ml-2 font-bold text-gray-800">GitHub Mastery</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-6">
                <button onClick={() => scrollToSection('tips')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'tips' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Enhancement Tips
                </button>
                <button onClick={() => scrollToSection('features')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'features' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Key Features
                </button>
                <button onClick={() => scrollToSection('videos')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'videos' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Videos
                </button>
                <button onClick={() => scrollToSection('assistant')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeSection === 'assistant' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  AI Assistant
                </button>
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
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
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'tips' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              Enhancement Tips
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'features' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              Key Features
            </button>
            <button 
              onClick={() => scrollToSection('videos')} 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'videos' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              Videos
            </button>
            <button 
              onClick={() => scrollToSection('assistant')} 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeSection === 'assistant' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} w-full text-left`}
            >
              AI Assistant
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <div className="mx-auto bg-green-600 text-white text-sm py-1 px-3 rounded-full inline-block mb-4">
            Boost Your Developer Presence
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
            GitHub Profile Mastery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your developer portfolio and unlock new career opportunities
          </p>
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => scrollToSection('assistant')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              Try AI Assistant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </header>

        {/* Enhancement Tips Section (enhanced) */}
        <section id="tips" className="mb-20 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              Enhancement Tips
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these proven strategies to make your GitHub profile stand out from the crowd
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Profile Essentials
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create a professional, high-quality profile picture.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Write a compelling bio that reflects your skills and interests.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create a detailed README.md profile that showcases your projects and skills.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    Pin your best repositories to make them easily visible to visitors.
                  </li>
                </ul>
              </div>
              <div>
              <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Activity Guidelines
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Commit code regularly to maintain an active contribution graph.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Contribute to open source projects to demonstrate collaboration.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create detailed documentation for all your repositories.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Follow relevant developers and engage with their work.
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
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the essential elements that make a GitHub profile truly impressive
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TipCard 
              icon={<ProfileIcon />}
              title="Professional Profile"
              description="Create a standout profile with a professional photo, comprehensive bio, and contact information."
            />
            <TipCard 
              icon={<HeadlineIcon />}
              title="Compelling README"
              description="Craft an engaging profile README that highlights your skills, experience, and showcases your personality."
            />
            <TipCard 
              icon={<AchievementIcon />}
              title="Project Highlights"
              description="Pin your best repositories and ensure they have detailed descriptions and documentation."
            />
            <TipCard 
              icon={<NetworkIcon />}
              title="Active Community"
              description="Contribute to open source, follow other developers, and engage with the broader GitHub ecosystem."
            />
            <TipCard 
              icon={<ContentIcon />}
              title="Quality Content"
              description="Maintain high code quality standards with clean code, thorough documentation, and meaningful commits."
            />
            <TipCard 
              icon={<ContentIcon />}
              title="Portfolio Integration"
              description="Connect your GitHub profile with your personal website, blog, and other social profiles."
            />
          </div>
        </section>

        {/* Videos Section */}
        <section id="videos" className="mb-20 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              Learning Resources
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch these videos to learn expert techniques for optimizing your GitHub presence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {YouTubeVideos.map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                    className="w-full h-full object-cover"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub AI Assistant Section */}
        <section id="assistant" className="scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              GitHub Profile AI Assistant
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get personalized advice and answers to all your GitHub profile questions
            </p>
          </div>
          <GitHubChatbot />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">GitHub Mastery</h3>
              <p className="text-gray-400 text-sm">
                Helping developers create impressive GitHub profiles to showcase their skills and projects.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Home</a></li>
                <li><a href="#tips" className="hover:text-green-400 transition-colors">Enhancement Tips</a></li>
                <li><a href="#features" className="hover:text-green-400 transition-colors">Key Features</a></li>
                <li><a href="#videos" className="hover:text-green-400 transition-colors">Videos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://docs.github.com" className="hover:text-green-400 transition-colors">GitHub Docs</a></li>
                <li><a href="https://github.com/topics/awesome-profile-readme" className="hover:text-green-400 transition-colors">Awesome READMEs</a></li>
                <li><a href="https://github.blog" className="hover:text-green-400 transition-colors">GitHub Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} GitHub Mastery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GitHubEnhancementPage;