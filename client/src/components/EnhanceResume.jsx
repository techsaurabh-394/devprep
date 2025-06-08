
import React, { useState } from "react";
import axios from "axios";

const Career = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [resume, setResume] = useState(null);
    const [promptType, setPromptType] = useState("strengths");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state
    const [errorMessage, setErrorMessage] = useState(""); // Error message for user feedback

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
        setErrorMessage(""); // Reset error message on file change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jobDescription || !resume) {
            setErrorMessage("Please provide all required fields: Job Description and Resume.");
            return;
        }

        const formData = new FormData();
        formData.append("job_description", jobDescription);  // Ensure the correct key name
        formData.append("resume", resume);
        formData.append("prompt_type", promptType);

        try {
            setLoading(true);
            setErrorMessage(""); // Reset error message before request
            const res = await axios.post(
                "http://127.0.0.1:5000/analyze-resume",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setResponse(res.data.response || "No response received.");
        } catch (err) {
            console.error(err);
            setErrorMessage(`Error analyzing resume: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-lg bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-center">ATS Resume Expert</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        placeholder="Enter Job Description"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="block w-full border p-2 rounded"
                        rows="5"
                    />
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="block w-full border p-2 rounded"
                    />
                    <select
                        value={promptType}
                        onChange={(e) => setPromptType(e.target.value)}
                        className="block w-full border p-2 rounded"
                    >
                        <option value="strengths">Analyze Strengths</option>
                        <option value="match">Percentage Match</option>
                    </select>
                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        className={`w-full p-2 rounded text-white ${
                            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
                {response && (
                    <div className="mt-4 p-4 bg-gray-50 rounded shadow">
                        <h2 className="font-bold">Response:</h2>
                        <p>{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Career;
