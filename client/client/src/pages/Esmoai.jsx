import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Send,
  Bot,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Download,
} from "lucide-react";
import SEO from "../components/SEO";

const genAI = new GoogleGenerativeAI("AIzaSyDzYHVthRT3e9Hy9UNu9CBGgBfRqjWYKVw");

export function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const speechSynthRef = useRef(null);
  const recognitionRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "bot", content: text }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  React.useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + " " + transcript.trim());
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    }
  };

  const formatText = (text) => {
    const segments = [];
    const codeBlockRegex = /```([\w]*)\n([\s\S]*?)\n```/g;

    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      segments.push({
        type: "code",
        language: match[1] || "code",
        content: match[2],
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      segments.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    return segments;
  };

  const formatTextContent = (content) => {
    if (!content) return null;

    const withBulletPoints = content.replace(
      /^\s*\*\s+(.*?)$/gm,
      "<li>$1</li>"
    );

    const withBold = withBulletPoints.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    const withHeaders = withBold.replace(
      /\*\*\*(.*?)\*\*\*/g,
      '<h3 class="text-lg font-bold my-2">$1</h3>'
    );

    let withParagraphs = withHeaders;

    withParagraphs = withParagraphs.replace(/<li>(.*?)<\/li>/g, (match) => {
      return `<ul class="list-disc ml-5 my-2">${match}</ul>`;
    });

    withParagraphs = withParagraphs.replace(
      /<\/ul>\s*<ul class="list-disc ml-5 my-2">/g,
      ""
    );

    const paragraphs = withParagraphs.split("\n\n");
    withParagraphs = paragraphs
      .map((p) => {
        if (!p.includes("<h3") && !p.includes("<ul") && p.trim() !== "") {
          return `<p class="my-2">${p}</p>`;
        }
        return p;
      })
      .join("\n");

    return <div dangerouslySetInnerHTML={{ __html: withParagraphs }} />;
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const speakText = (text) => {
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const textOnlyContent = text.replace(
      /```[\s\S]*?```/g,
      "Code block omitted for speech"
    );

    const utterance = new SpeechSynthesisUtterance(textOnlyContent);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const downloadChat = () => {
    if (messages.length === 0) return;

    // Format the chat for download
    let chatContent = "# AI Learning Assistant Chat\n\n";

    messages.forEach((message) => {
      const role = message.role === "user" ? "You" : "AI Assistant";
      chatContent += `## ${role}:\n${message.content}\n\n`;
    });

    // Create a downloadable file
    const blob = new Blob([chatContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    // Generate a filename with current date and time
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[:.]/g, "-").slice(0, 19);

    a.href = url;
    a.download = `ai-chat-${formattedDate}.md`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <>
      <SEO
        title="AI Learning Assistant for Developers"
        description="Learn programming concepts, get code explanations, and receive personalized guidance with our AI-powered learning assistant. Perfect for developers of all levels."
        keywords="AI learning assistant, programming tutor, code explanation, developer learning tool, technical concepts, AI programming help"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">AI Learning Assistant</h2>
            </div>
            <button
              onClick={downloadChat}
              disabled={messages.length === 0}
              className="text-white hover:text-indigo-200 focus:outline-none disabled:opacity-50"
              title="Download Chat"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="h-[500px] overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, messageIndex) => {
              const formattedSegments = formatText(message.content);

              return (
                <div
                  key={messageIndex}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.role === "bot" && (
                      <div className="flex justify-end mb-1">
                        <button
                          onClick={() => speakText(message.content)}
                          className="text-gray-500 hover:text-indigo-600 focus:outline-none"
                          title={isSpeaking ? "Stop reading" : "Read aloud"}
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                    {formattedSegments.map((segment, segmentIndex) => {
                      const segmentKey = `${messageIndex}-${segmentIndex}`;

                      if (segment.type === "text") {
                        return (
                          <div key={segmentKey} className="formatted-text">
                            {formatTextContent(segment.content)}
                          </div>
                        );
                      } else if (segment.type === "code") {
                        return (
                          <div
                            key={segmentKey}
                            className="my-4 rounded overflow-hidden"
                          >
                            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                              <span className="text-sm">
                                {segment.language}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(segment.content, segmentKey)
                                }
                                className="text-gray-300 hover:text-white focus:outline-none"
                              >
                                {copiedIndex === segmentKey ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                              <code>{segment.content}</code>
                            </pre>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything about your studies..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={toggleListening}
                className={`p-2 rounded-lg focus:outline-none ${
                  isListening
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
