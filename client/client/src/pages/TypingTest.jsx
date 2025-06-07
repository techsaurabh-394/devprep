import { useState, useEffect, useRef } from 'react';

const TypingTest = () => {
  // State variables
  const [words, setWords] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charactersTyped, setCharactersTyped] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [timer, setTimer] = useState(30); // Default timer setting
  const [timeLeft, setTimeLeft] = useState(timer);
  const [isActive, setIsActive] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentTheme, setCurrentTheme] = useState('blue'); // Default theme
  const [customTime, setCustomTime] = useState(45);
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  
  const inputRef = useRef(null);
  const wordContainerRef = useRef(null);

  // Word lists by difficulty
  const wordLists = {
    easy: [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 
      'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 
      'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
    ],
    medium: [
      'about', 'above', 'after', 'again', 'along', 'began', 'below', 'between', 'both', 'car', 'children', 
      'city', 'close', 'country', 'earth', 'every', 'father', 'food', 'great', 'hand', 'house', 'large', 
      'learn', 'letter', 'light', 'money', 'mother', 'mountain', 'night', 'paper', 'people', 'picture', 
      'plant', 'river', 'school', 'story', 'study', 'thing', 'thought', 'water', 'while', 'world', 'would'
    ],
    hard: [
      'algorithm', 'application', 'beautiful', 'calculation', 'challenging', 'characteristic', 'combination', 
      'competition', 'comprehensive', 'configuration', 'considerable', 'constitution', 'contemporary', 
      'contribution', 'conversation', 'corporation', 'distribution', 'documentation', 'effectiveness', 
      'environmental', 'extraordinary', 'functionality', 'implementation', 'infrastructure', 'innovation', 
      'institution', 'intelligence', 'international', 'investigation', 'mathematics', 'multiplication', 
      'negotiation', 'opportunity', 'organization', 'performance', 'perspective', 'possibility', 
      'preparation', 'productivity', 'professional', 'programming', 'qualification', 'relationship', 
      'requirement', 'responsibility', 'satisfaction', 'significance', 'subscription', 'technology', 
      'temperature', 'understanding'
    ]
  };

  // Theme settings
  const themes = {
    blue: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-500',
      accent: 'bg-blue-400',
      text: 'text-blue-600',
      hoverBg: 'hover:bg-blue-700',
      borderColor: 'border-blue-500',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-purple-500'
    },
    green: {
      primary: 'bg-emerald-600',
      secondary: 'bg-emerald-500',
      accent: 'bg-emerald-400',
      text: 'text-emerald-600',
      hoverBg: 'hover:bg-emerald-700',
      borderColor: 'border-emerald-500',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-teal-500'
    },
    purple: {
      primary: 'bg-purple-600',
      secondary: 'bg-purple-500',
      accent: 'bg-purple-400',
      text: 'text-purple-600',
      hoverBg: 'hover:bg-purple-700',
      borderColor: 'border-purple-500',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-pink-500'
    },
    dark: {
      primary: 'bg-slate-700',
      secondary: 'bg-slate-600',
      accent: 'bg-slate-500',
      text: 'text-slate-300',
      hoverBg: 'hover:bg-slate-800',
      borderColor: 'border-slate-500',
      gradientFrom: 'from-slate-700',
      gradientTo: 'to-slate-900'
    }
  };

  // Generate random words
  const generateWords = () => {
    const wordPool = wordLists[difficulty];
    const randomWords = [];
    const wordCount = 200; // Plenty of words for any test duration
    
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * wordPool.length);
      randomWords.push(wordPool[randomIndex]);
    }
    
    setWords(randomWords);
  };

  // Initialize test on first render
  useEffect(() => {
    generateWords();
  }, [difficulty]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      endTest();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Auto-scroll words container
  useEffect(() => {
    if (wordContainerRef.current && isActive) {
      const container = wordContainerRef.current;
      const activeWord = container.querySelector('.word.active');
      
      if (activeWord) {
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeWord.getBoundingClientRect();
        
        if (activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom) {
          const scrollOffset = activeWord.offsetTop - container.offsetTop - 
            (container.clientHeight / 2) + (activeWord.clientHeight / 2);
          container.scrollTo({ top: scrollOffset, behavior: 'smooth' });
        }
      }
    }
  }, [currentWordIndex, isActive]);

  // Focus input field when test starts
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Calculate WPM and accuracy in real-time
  useEffect(() => {
    if (isActive) {
      const minutes = (timer - timeLeft) / 60;
      if (minutes > 0) {
        const wordsTyped = charactersTyped / 5; // Standard: 5 characters = 1 word
        const currentWpm = Math.round(wordsTyped / minutes);
        setWpm(currentWpm);
        
        const currentAccuracy = correctCharacters > 0 
          ? Math.round((correctCharacters / charactersTyped) * 100) 
          : 0;
        setAccuracy(currentAccuracy);
      }
    }
  }, [charactersTyped, correctCharacters, timeLeft, timer, isActive]);

  // Start the test
  const startTest = () => {
    setTestComplete(false);
    setIsActive(true);
    setTimeLeft(timer);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setCharactersTyped(0);
    setCorrectCharacters(0);
    setWpm(0);
    setAccuracy(100);
    generateWords();
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // End the test
  const endTest = () => {
    setIsActive(false);
    setTestComplete(true);
  };

  // Reset the test
  const resetTest = () => {
    setIsActive(false);
    setTestComplete(false);
    setTimeLeft(timer);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setCharactersTyped(0);
    setCorrectCharacters(0);
    setWpm(0);
    setAccuracy(100);
    generateWords();
  };

  // Handle user input
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isActive && value.length > 0) {
      startTest();
    }
    
    if (isActive) {
      setCurrentInput(value);
      
      // If space is pressed, move to next word
      if (value.endsWith(' ')) {
        const typedWord = value.trim();
        const currentWord = words[currentWordIndex];
        
        // Calculate correct characters
        const minLength = Math.min(typedWord.length, currentWord.length);
        let correctChars = 0;
        
        for (let i = 0; i < minLength; i++) {
          if (typedWord[i] === currentWord[i]) {
            correctChars++;
          }
        }
        
        setCharactersTyped(prev => prev + typedWord.length + 1); // +1 for space
        setCorrectCharacters(prev => prev + correctChars);
        setCurrentWordIndex(prev => prev + 1);
        setCurrentInput('');
      }
    }
  };

  // Handle timer change
  const handleTimerChange = (seconds) => {
    setTimer(seconds);
    setTimeLeft(seconds);
    resetTest();
  };

  // Handle custom timer change
  const handleCustomTimeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 300) {
      setCustomTime(value);
    }
  };

  // Apply custom time
  const applyCustomTime = () => {
    handleTimerChange(customTime);
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Change theme
  const changeTheme = (theme) => {
    setCurrentTheme(theme);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    generateWords();
    resetTest();
  };

  // Get current theme
  const theme = themes[currentTheme];

  return (
    <div className={`min-h-screen font-sans text-gray-800 ${currentTheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className={`text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`}>
            Speed Type
          </h1>
          <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Test your typing speed and accuracy
          </p>
        </header>
        
        {/* Main Content */}
        <main>
          {/* Test Area */}
          <div className={`relative mb-6 p-6 rounded-lg shadow-lg ${currentTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            {/* Timer Display */}
            <div className="flex justify-between items-center mb-4">
              <div className={`text-2xl font-bold ${timeLeft <= 5 && isActive ? 'text-red-500' : currentTheme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                {timeLeft}s
              </div>
              <div className="flex space-x-2">
                <div className={`px-3 py-1 rounded-lg ${currentTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <span className="font-semibold">WPM:</span> {wpm}
                </div>
                <div className={`px-3 py-1 rounded-lg ${currentTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <span className="font-semibold">Accuracy:</span> {accuracy}%
                </div>
              </div>
            </div>
            
            {/* Words Display */}
            <div 
              ref={wordContainerRef}
              className={`h-24 mb-4 overflow-y-auto p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'} leading-relaxed`}
            >
              <div className="flex flex-wrap">
                {words.map((word, index) => (
                  <span 
                    key={index} 
                    className={`word mr-2 mb-2 px-1 rounded ${
                      index === currentWordIndex 
                        ? `active ${theme.text} font-bold` 
                        : index < currentWordIndex 
                          ? `${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}` 
                          : `${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              disabled={!isActive && testComplete}
              placeholder={isActive ? "Type here..." : "Type to start..."}
              className={`w-full p-3 rounded-lg border-2 focus:outline-none text-lg 
                ${currentTheme === 'dark' 
                  ? 'bg-slate-700 text-white border-slate-600 focus:border-slate-400' 
                  : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'}`}
            />
            
            {/* Overlay for completed test */}
            {testComplete && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg z-10">
                <div className={`text-center p-8 rounded-lg ${currentTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                  <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${theme.accent} text-white`}>
                      <p className="text-sm">Words Per Minute</p>
                      <p className="text-3xl font-bold">{wpm}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${accuracy >= 90 ? 'bg-green-500' : accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                      <p className="text-sm">Accuracy</p>
                      <p className="text-3xl font-bold">{accuracy}%</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetTest}
                    className={`${theme.primary} text-white py-2 px-6 rounded-lg ${theme.hoverBg} transition duration-200`}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap justify-between mb-6 gap-2">
            {/* Timer Options */}
            <div className="flex flex-wrap gap-2">
              {[15, 30, 60].map(seconds => (
                <button
                  key={seconds}
                  onClick={() => handleTimerChange(seconds)}
                  className={`py-2 px-4 rounded-lg transition duration-200 
                    ${timer === seconds 
                      ? `${theme.primary} text-white` 
                      : `${currentTheme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} 
                         ${currentTheme === 'dark' ? 'text-white' : 'text-gray-700'}`}`}
                >
                  {seconds}s
                </button>
              ))}
              <div className="flex">
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={customTime}
                  onChange={handleCustomTimeChange}
                  className={`w-16 px-2 py-2 rounded-l-lg border-y border-l 
                    ${currentTheme === 'dark' 
                      ? 'bg-slate-700 text-white border-slate-600' 
                      : 'bg-white text-gray-800 border-gray-300'}`}
                />
                <button
                  onClick={applyCustomTime}
                  className={`py-2 px-3 rounded-r-lg ${theme.primary} text-white ${theme.hoverBg} transition duration-200`}
                >
                  Set
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={resetTest}
                className={`py-2 px-4 rounded-lg ${currentTheme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition duration-200`}
              >
                Reset
              </button>
              <button
                onClick={toggleSettings}
                className={`py-2 px-4 rounded-lg ${theme.primary} text-white ${theme.hoverBg} transition duration-200`}
              >
                {showSettings ? 'Hide Settings' : 'Settings'}
              </button>
            </div>
          </div>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className={`p-6 rounded-lg shadow-lg mb-6 ${currentTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              
              {/* Themes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(themes).map(themeName => (
                    <button
                      key={themeName}
                      onClick={() => changeTheme(themeName)}
                      className={`py-2 px-4 rounded-lg transition duration-200 
                        ${currentTheme === themeName 
                          ? `${themes[themeName].primary} text-white` 
                          : `${currentTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} 
                             ${currentTheme === 'dark' ? 'text-white' : 'text-gray-700'}`}`}
                    >
                      {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Difficulty */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {['easy', 'medium', 'hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => changeDifficulty(diff)}
                      className={`py-2 px-4 rounded-lg transition duration-200 
                        ${difficulty === diff 
                          ? `${theme.primary} text-white` 
                          : `${currentTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} 
                             ${currentTheme === 'dark' ? 'text-white' : 'text-gray-700'}`}`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className={`p-6 rounded-lg ${currentTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <h2 className="text-xl font-bold mb-2">How to Use</h2>
            <ul className={`list-disc list-inside space-y-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>Type in the input field to start the test</li>
              <li>The timer will start automatically when you begin typing</li>
              <li>Type each word and press space to move to the next word</li>
              <li>Select different time limits or set a custom time</li>
              <li>Choose your difficulty level and theme in settings</li>
            </ul>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Speed Type © {new Date().getFullYear()} | Built with React, Vite & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TypingTest;