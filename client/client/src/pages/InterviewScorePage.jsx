import React, { useState } from 'react';

const InterviewScorePage = () => {
  const [score, setScore] = useState(null);

  // Example scoring logic (replace with actual logic)
  const calculateScore = (answer) => {
    let score = 0;
    if (answer.includes("good")) score += 5;
    if (answer.includes("excellent")) score += 10;
    return score;
  };

  const handleSubmitAnswer = (event) => {
    event.preventDefault();
    const answer = event.target.answer.value;
    const evaluatedScore = calculateScore(answer);
    setScore(evaluatedScore);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Interview Answer Scoring</h2>
      <form onSubmit={handleSubmitAnswer}>
        <textarea
          name="answer"
          placeholder="Your interview answer..."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="6"
        />
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded-md">
          Submit Answer
        </button>
      </form>

      {score !== null && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <h3>Your Score: {score}</h3>
          <p>{score >= 8 ? "Great job!" : "You can improve."}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewScorePage;
