import React from "react";

const InterviewReport = ({ feedbackData, onClose, onDownload }) => {
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
              <div key={index} className="border rounded-lg p-4">
                <div className="font-semibold mb-2">
                  Question {index + 1}: {qa.question}
                </div>
                <div className="text-gray-700 mb-2">
                  Your Answer: {qa.answer}
                </div>
                <div className="flex items-center mb-2">
                  <div className="font-medium">Score: </div>
                  <div className="ml-2 text-purple-700">{qa.score}/10</div>
                </div>
                <div className="text-gray-700 mb-2">{qa.feedback}</div>
                <div className="text-gray-700">
                  <span className="font-medium">Areas to Improve: </span>
                  {qa.improvements}
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
