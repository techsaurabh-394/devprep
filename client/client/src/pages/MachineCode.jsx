import React, { useState, useEffect, useRef } from "react";
import SEO from "../components/SEO";

const MachineCode = () => {
  const [code, setCode] = useState(
    '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [tokenCount, setTokenCount] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("c");
  const [isRunning, setIsRunning] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showSolvedPopup, setShowSolvedPopup] = useState(false);
  const editorRef = useRef(null);

  // Sample coding questions
  const codingQuestions = [
    {
      id: 1,
      title: "Hello World",
      description:
        "Write a program that prints 'Hello, World!' to the console.",
      language: "c",
      template:
        "#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}",
      solution: 'printf("Hello, World!");',
      solved: false,
    },
    {
      id: 2,
      title: "Sum of Two Numbers",
      description:
        "Write a program that adds two numbers (5 and 7) and prints the result.",
      language: "c",
      template:
        "#include <stdio.h>\n\nint main() {\n    // Add 5 and 7 and print the result\n    \n    return 0;\n}",
      solution: 'printf("%d", 5 + 7);',
      solved: false,
    },
    {
      id: 3,
      title: "FizzBuzz Simple",
      description:
        "Print numbers from 1 to 15. For multiples of 3, print 'Fizz' instead. For multiples of 5, print 'Buzz'. For multiples of both, print 'FizzBuzz'.",
      language: "c",
      template:
        "#include <stdio.h>\n\nint main() {\n    // Implement FizzBuzz for numbers 1-15\n    \n    return 0;\n}",
      solution:
        'for (int i = 1; i <= 15; i++) {\n        if (i % 3 == 0 && i % 5 == 0) {\n            printf("FizzBuzz\\n");\n        } else if (i % 3 == 0) {\n            printf("Fizz\\n");\n        } else if (i % 5 == 0) {\n            printf("Buzz\\n");\n        } else {\n            printf("%d\\n", i);\n        }\n    }',
      solved: false,
    },
    {
      id: 4,
      title: "Even or Odd",
      description:
        "Write a program that determines if a number (42) is even or odd and prints the result.",
      language: "c",
      template:
        "#include <stdio.h>\n\nint main() {\n    int num = 42;\n    // Check if num is even or odd and print the result\n    \n    return 0;\n}",
      solution:
        'if (num % 2 == 0) {\n        printf("%d is even\\n", num);\n    } else {\n        printf("%d is odd\\n", num);\n    }',
      solved: false,
    },
    {
      id: 5,
      title: "C++ Vector Example",
      description:
        "Create a vector, add 5 numbers to it, and print them in reverse order.",
      language: "cpp",
      template:
        "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Create a vector, add 5 numbers to it, and print in reverse\n    \n    return 0;\n}",
      solution:
        'vector<int> numbers;\n    for (int i = 1; i <= 5; i++) {\n        numbers.push_back(i);\n    }\n    \n    for (int i = numbers.size() - 1; i >= 0; i--) {\n        cout << numbers[i] << " ";\n    }',
      solved: false,
    },
  ];

  const [questions, setQuestions] = useState(codingQuestions);

  // Calculate token count (simplified)
  useEffect(() => {
    const calculateTokens = () => {
      if (!code) return 0;
      // Simple tokenization by splitting on whitespace and punctuation
      const tokens = code
        .split(/[\s\n\t{}();,=<>"'/\\+\-*&|^%!~?\[\]]+/)
        .filter(Boolean);
      return tokens.length;
    };

    setTokenCount(calculateTokens());
  }, [code]);

  // Tab handling
  const handleTab = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);

      // Set cursor position after inserted tab
      setTimeout(() => {
        editorRef.current.selectionStart = start + 4;
        editorRef.current.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Simulate code execution
  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    setError("");

    // Simulate processing time
    setTimeout(() => {
      try {
        // Very basic parsing to simulate running C/C++ code
        if (language === "c" || language === "cpp") {
          if (code.includes("printf") || code.includes("cout")) {
            const printPattern =
              language === "c"
                ? /printf\s*\(\s*"([^"]*)"\s*\)/g
                : /cout\s*<<\s*"([^"]*)"/g;

            let printMatches = [];
            let match;

            while ((match = printPattern.exec(code)) !== null) {
              printMatches.push(match[1]);
            }

            if (printMatches.length > 0) {
              setOutput(printMatches.join("\n"));
            } else {
              setOutput("Program executed with no output");
            }
          } else if (code.includes("return")) {
            setOutput("Program executed successfully");
          } else {
            setOutput("No executable statements found");
          }

          // Check for common errors
          if (!code.includes("main")) {
            setError("Error: No main function found");
          } else if (
            (language === "c" && !code.includes("#include")) ||
            (language === "cpp" &&
              !code.includes("#include") &&
              !code.includes("using namespace"))
          ) {
            setError("Warning: Missing standard library includes");
          } else if (!code.includes("return") && code.includes("int main")) {
            setError("Warning: Missing return statement in main function");
          }
        }

        // Check if the current question is solved
        if (selectedQuestion) {
          const question = questions.find((q) => q.id === selectedQuestion);
          if (
            question &&
            !question.solved &&
            code.includes(question.solution)
          ) {
            // Mark question as solved
            const updatedQuestions = questions.map((q) =>
              q.id === selectedQuestion ? { ...q, solved: true } : q
            );
            setQuestions(updatedQuestions);
            setShowSolvedPopup(true);
            setTimeout(() => setShowSolvedPopup(false), 3000);
          }
        }
      } catch (err) {
        setError(`Runtime Error: ${err.message}`);
      }

      setIsRunning(false);
    }, 800);
  };

  const clearOutput = () => {
    setOutput("");
    setError("");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleQuestions = () => {
    setShowQuestions(!showQuestions);
  };

  const selectQuestion = (id) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      setSelectedQuestion(id);
      setLanguage(question.language);
      setCode(question.template);
      setOutput("");
      setError("");
    }
  };

  return (
    <>
      <SEO
        title="Machine Coding Practice & Challenges"
        description="Practice machine coding with real-world scenarios. Improve your coding skills with hands-on exercises and get instant feedback."
        keywords="machine coding, coding challenges, programming practice, coding exercises, software development practice, coding interview preparation"
      />
      <div
        className={`flex flex-col h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-4 ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Terminal Code Editor</h1>
            <select
              className={`p-1 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-white"
              }`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-300"
              }`}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={toggleQuestions}
              className={`px-3 py-1 rounded ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {showQuestions ? "Hide Questions" : "Show Questions"}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Tokens: {tokenCount}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Questions panel (conditionally rendered) */}
          {showQuestions && (
            <div
              className={`w-64 p-4 overflow-y-auto ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } border-r ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <h2 className="font-semibold mb-4">Coding Challenges</h2>
              <ul className="space-y-2">
                {questions.map((question) => (
                  <li
                    key={question.id}
                    onClick={() => selectQuestion(question.id)}
                    className={`p-2 rounded-md cursor-pointer ${
                      selectedQuestion === question.id
                        ? theme === "dark"
                          ? "bg-blue-800"
                          : "bg-blue-100"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {question.id}. {question.title}
                      </span>
                      {question.solved && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Editor */}
          <div
            className={`${showQuestions ? "w-1/2" : "w-1/2"} p-4 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } border-r ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">
                {selectedQuestion
                  ? `${
                      questions.find((q) => q.id === selectedQuestion)?.title
                    } (#${selectedQuestion})`
                  : "Editor"}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`px-3 py-1 rounded-md ${
                    theme === "dark"
                      ? "bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50"
                      : "bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:opacity-50"
                  } text-white`}
                >
                  {isRunning ? "Running..." : "Run ▶"}
                </button>
              </div>
            </div>

            {/* Question description (if selected) */}
            {selectedQuestion && (
              <div
                className={`mb-3 p-3 rounded-md ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <p>
                  {
                    questions.find((q) => q.id === selectedQuestion)
                      ?.description
                  }
                </p>
              </div>
            )}

            <textarea
              ref={editorRef}
              className={`w-full ${
                selectedQuestion ? "h-3/4" : "h-full"
              } p-2 font-mono text-sm resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === "dark"
                  ? "bg-gray-900 text-gray-200"
                  : "bg-gray-50 text-gray-800"
              }`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTab}
              spellCheck="false"
            />
          </div>

          {/* Output */}
          <div
            className={`${showQuestions ? "w-1/3" : "w-1/2"} p-4 ${
              theme === "dark" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Output</h2>
              <button
                onClick={clearOutput}
                className={`px-3 py-1 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Clear
              </button>
            </div>
            <div
              className={`w-full h-full p-3 font-mono text-sm rounded-md overflow-auto ${
                theme === "dark"
                  ? "bg-black text-green-400"
                  : "bg-white text-black"
              }`}
            >
              {error && <div className="text-red-500 mb-2">{error}</div>}
              {output && <pre className="whitespace-pre-wrap">{output}</pre>}
              {!output && !error && !isRunning && (
                <span className="text-gray-500">
                  Run your code to see output here
                </span>
              )}
              {isRunning && (
                <div className="flex items-center">
                  <div className="animate-pulse mr-2">⏳</div>
                  <span>Running code...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Solved Popup */}
        {showSolvedPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div
              className={`relative p-6 rounded-lg shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } max-w-sm`}
            >
              <div className="text-center">
                <div className="mb-4 text-green-500 text-5xl">✓</div>
                <h3 className="text-xl font-bold mb-2">Challenge Completed!</h3>
                <p className="mb-4">
                  You've successfully solved Challenge #{selectedQuestion}!
                </p>
                <button
                  onClick={() => setShowSolvedPopup(false)}
                  className={`px-4 py-2 rounded-md ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MachineCode;
