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
      <nav className="flex items-center justify-between px-4 md:px-12 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <img
            src="/vite.svg"
            alt="logo"
            className="h-7 w-7 cursor-pointer"
            onClick={() => (window.location.href = "/dashboard")}
          />
          <span
            className="text-2xl font-extrabold text-[#6c47ff] tracking-tight cursor-pointer"
            onClick={() => (window.location.href = "/dashboard")}
          >
            AI Interview Prep
          </span>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="/dashboard"
            className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition"
          >
            Dashboard
          </a>
          <a
            href="/upgrade"
            className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition"
          >
            Upgrade
          </a>
          <a
            href="/settings"
            className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition"
          >
            Settings
          </a>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-6 py-2 rounded-lg border border-[#d1d5db] bg-white text-[#6c47ff] font-semibold text-base shadow-sm hover:bg-[#f3f0ff] transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
      <div className="bg-white rounded-xl shadow p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-[#6c47ff] mb-4">
          AI Mock Interview
        </h1>
        {loading ? (
          <p className="text-gray-600 mb-6">Loading questions...</p>
        ) : error ? (
          <p className="text-red-600 mb-6">{error}</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-600 mb-6">
            No questions found for this interview.
          </p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#f7f7fb] rounded-lg border border-gray-200"
              >
                <span className="font-semibold text-[#6c47ff]">
                  Q{idx + 1}:
                </span>{" "}
                {q}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSessionPage;
