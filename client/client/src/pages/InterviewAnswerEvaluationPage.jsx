import React, { useState } from 'react';

const InterviewAnswerEvaluationPage = () => {
  const [evaluation, setEvaluation] = useState(null);

  // Example AI-based evaluation logic (replace with actual AI model interaction)
  const evaluateAnswer = (answer) => {
    let feedback = "Your answer is okay.";
    if (answer.includes("excellent")) feedback = "Great answer!";
    if (answer.length < 50) feedback = "Please elaborate more in your answer.";
    return feedback;
  };

  const handleSubmitAnswer = (event) => {
    event.preventDefault();
    const answer = event.target.answer.value;
    const feedback = evaluateAnswer(answer);
    setEvaluation(feedback);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Interview Answer Evaluation</h2>
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

      {evaluation && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-md">
          <h3>Evaluation Feedback:</h3>
          <p>{evaluation}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewAnswerEvaluationPage;
