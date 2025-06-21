import React from "react";

// Helper to detect question type
function getQuestionType(question) {
  if (/sql/i.test(question)) return "SQL";
  if (/code|program|implement|function|method|write|algorithm/i.test(question))
    return "Coding";
  if (
    /data structure|array|tree|graph|sort|search|dsa|linked list|stack|queue|heap|trie|binary|bfs|dfs|recursion|dynamic programming/i.test(
      question
    )
  )
    return "DSA";
  if (
    /scenario|situation|case|team|project|experience|challenge|conflict|lead|mentor|feedback|collaborate|stakeholder|deadline|stress|mistake|failure|success|motivate|improve|learn|growth/i.test(
      question
    )
  )
    return "Behavioral";
  return "General";
}

const InterviewReport = ({ feedbackData, onClose }) => {
  const downloadReport = () => {
    // Create report content in markdown format
    const reportContent = `# Interview Report
${feedbackData.overallSummary}

## Question-wise Analysis
${feedbackData.questionAnalysis
  .map(
    (qa, index) => `
### Question ${index + 1}: ${qa.question}
- Your Answer: ${qa.answer}
- Score: ${qa.score}/10
- Analysis: ${qa.feedback}
- Improvement Areas: ${qa.improvements}
`
  )
  .join("\n")}

## Overall Performance
- Overall Score: ${feedbackData.overallScore}/100
- Key Strengths: ${feedbackData.strengths.join(", ")}
- Areas to Improve: ${feedbackData.areasToImprove.join(", ")}

## Recommendations
${feedbackData.recommendations}
`;

    // Create and download the file
    const blob = new Blob([reportContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview-report.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">
            Interview Performance Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Overall Summary */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Overall Summary</h3>
          <p className="text-gray-700">{feedbackData.overallSummary}</p>
          <div className="mt-4 bg-purple-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-center text-purple-800">
              {feedbackData.overallScore}/100
            </div>
            <div className="text-center text-purple-600 mt-1">
              Overall Score
            </div>
          </div>
        </div>

        {/* Question Analysis */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Question-wise Analysis</h3>
          <div className="space-y-4">
            {feedbackData.questionAnalysis.map((qa, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gradient-to-br from-white to-purple-50 shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold shadow ${(() => {
                      const type = getQuestionType(qa.question);
                      if (type === "Coding") return "bg-blue-700 text-white";
                      if (type === "SQL") return "bg-green-600 text-white";
                      if (type === "DSA") return "bg-orange-500 text-white";
                      if (type === "Behavioral")
                        return "bg-pink-400 text-white";
                      return "bg-gray-300 text-gray-800";
                    })()}`}
                  >
                    {getQuestionType(qa.question)}
                  </span>
                  <div className="font-semibold">Question {index + 1}:</div>
                  <div className="text-gray-700">{qa.question}</div>
                </div>
                <div className="text-gray-700 mb-2">
                  <span className="font-medium">Your Answer:</span>
                  <span
                    className={`ml-2 ${
                      ["Coding", "SQL", "DSA"].includes(
                        getQuestionType(qa.question)
                      )
                        ? "font-mono bg-gray-900 text-green-200 px-2 py-1 rounded"
                        : ""
                    }`}
                  >
                    {qa.answer}
                  </span>
                </div>
                <div className="flex items-center mb-2 gap-2">
                  <div className="font-medium">Score:</div>
                  <div className="ml-2 text-purple-700 font-bold">
                    {qa.score}/10
                  </div>
                  {/* Progress bar */}
                  <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-purple-400 to-blue-400"
                      style={{ width: `${qa.score * 10}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-gray-700 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <span>{qa.feedback}</span>
                </div>
                <div className="text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <span className="font-medium">Areas to Improve:</span>
                  <span className="ml-1">
                    {Array.isArray(qa.improvements)
                      ? qa.improvements.join(", ")
                      : qa.improvements}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Areas to Improve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-800">Key Strengths</h3>
            <ul className="list-disc pl-5 text-green-700">
              {feedbackData.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800">
              Areas to Improve
            </h3>
            <ul className="list-disc pl-5 text-yellow-700">
              {feedbackData.areasToImprove.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Recommendations</h3>
          <div className="text-gray-700 whitespace-pre-line">
            {feedbackData.recommendations}
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <button
            onClick={downloadReport}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
