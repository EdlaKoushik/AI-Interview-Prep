import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

const FeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        const res = await axios.get(`/api/interview/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setInterview({
          ...res.data.interview,
          answers: Array.isArray(res.data.interview.answers) ? res.data.interview.answers : [],
          feedback: Array.isArray(res.data.interview.feedback) ? res.data.interview.feedback : [],
        });
      } catch (err) {
        setError("Failed to load feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, getToken]);

  if (loading) return <div className="p-8">Loading feedback...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!interview) return null;

  // Calculate a dummy score for demo (replace with real score if available)
  const total = interview.questions.length;
  const answered = interview.answers?.filter(a => a && a.length > 0).length || 0;
  const score = Math.round((answered / total) * 100);

  // Helper for feedback badge
  const getBadge = (feedback) => {
    if (!feedback) return null;
    if (/excellent|great|outstanding|impressive/i.test(feedback)) {
      return <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Excellent</span>;
    }
    if (/good|solid|clear|well/i.test(feedback)) {
      return <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">Good</span>;
    }
    if (/average|ok|adequate|fair/i.test(feedback)) {
      return <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">Average</span>;
    }
    if (/improve|weak|poor|needs|no answer/i.test(feedback)) {
      return <span className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">Needs Improvement</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f7f7fb] p-6">
      <Toaster position="top-center" />
      <div className="bg-white rounded-xl shadow p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-[#6c47ff] mb-4 flex items-center gap-2">
          <span>Interview Feedback</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700">Score:</span>
            <span className="text-2xl font-bold text-[#1db954]">{score}%</span>
          </span>
        </h1>
        <div className="mb-6">
          <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#6c47ff] to-[#1db954] transition-all"
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <span className="text-[#6c47ff]">Overall Feedback</span>
            {score === 100 && <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Perfect!</span>}
            {score >= 80 && score < 100 && <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">Great</span>}
            {score >= 60 && score < 80 && <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">Good</span>}
            {score < 60 && <span className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">Needs Work</span>}
          </h2>
          <div className="p-4 bg-[#f7f7fb] rounded-lg border border-gray-200 mb-4 text-gray-800 flex items-start gap-3">
            <span className="text-2xl text-[#6c47ff]">💡</span>
            <span>{interview.overallFeedback || <span className="italic text-gray-400">No overall feedback.</span>}</span>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <span className="text-[#6c47ff]">Per-Question Feedback</span>
            <span className="text-xs text-gray-500">({total} questions)</span>
          </h2>
          {interview.questions.map((q, idx) => (
            <div key={idx} className="mb-5 p-4 rounded-lg border border-gray-100 bg-[#fafbff] shadow-sm">
              <div className="font-semibold text-[#6c47ff] mb-1 flex items-center gap-2">
                <span>Q{idx + 1}:</span> <span>{q}</span>
              </div>
              <div className="text-gray-700 mb-1 flex items-center gap-2">
                <span className="font-medium">Your answer:</span>
                {interview.answers?.[idx] ? (
                  <span className="text-gray-900">{interview.answers[idx]}</span>
                ) : (
                  <span className="italic text-gray-400">No answer</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium text-green-700">Feedback:</span>
                <span>{interview.feedback?.[idx] || <span className="italic text-gray-400">No feedback</span>}</span>
                {getBadge(interview.feedback?.[idx])}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 px-6 py-2 rounded-lg bg-[#6c47ff] text-white font-bold shadow hover:bg-[#5433c6] transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
