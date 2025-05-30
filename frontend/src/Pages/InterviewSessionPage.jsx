import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Toaster, toast } from "react-hot-toast";

const InterviewSessionPage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
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
        setQuestions(res.data.interview.questions || []);
      } catch (err) {
        setError("Failed to load interview questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, getToken]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7fb] p-6">
      <Toaster position="top-center" />
      <div className="bg-white rounded-xl shadow p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-[#6c47ff] mb-4">AI Mock Interview</h1>
        {loading ? (
          <p className="text-gray-600 mb-6">Loading questions...</p>
        ) : error ? (
          <p className="text-red-600 mb-6">{error}</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-600 mb-6">No questions found for this interview.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="p-4 bg-[#f7f7fb] rounded-lg border border-gray-200">
                <span className="font-semibold text-[#6c47ff]">Q{idx + 1}:</span> {q}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSessionPage;
