import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  useAuth,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Toaster, toast } from "react-hot-toast";
import VideoRecorder from "../components/VideoRecorder";

const InterviewSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState("text");
  const [submitting, setSubmitting] = useState(false);
  // Speech recognition state
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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
        setMode(res.data.interview.mode || "text");
      } catch (err) {
        setError("Failed to load interview questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, getToken]);

  // Speech recognition handlers
  const getSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return SpeechRecognition ? new SpeechRecognition() : null;
  };

  const startListening = () => {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      toast.error("Speech Recognition not supported in this browser.");
      return;
    }
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswers((prev) => ({ ...prev, [current]: transcript }));
      setListening(false);
    };
    recognition.onerror = (event) => {
      toast.error("Speech recognition error: " + event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [current]: e.target.value });
  };

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(questions.length - 1, c + 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = await getToken();
      let finalAnswers = [];
      for (let i = 0; i < questions.length; i++) {
        finalAnswers.push(answers[i] || "");
      }
      await axios.post(
        `/api/interview/submit`,
        {
          interviewId: id,
          answers: finalAnswers,
          mode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // If video mode, close webcam after submit
      if (mode === "video") {
        window.dispatchEvent(new Event("close-webcam"));
      }
      toast.success("Interview submitted! Redirecting to feedback...");
      setTimeout(() => navigate(`/feedback/${id}`), 1200);
    } catch (err) {
      toast.error("Failed to submit interview.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f7f7fb] p-6">
      <Toaster position="top-center" />
      <nav className="flex items-center justify-between px-4 md:px-12 py-5 bg-white shadow-sm w-full mb-8">
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
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#6c47ff]">
                  Question {current + 1} of {questions.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={current === 0}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={current === questions.length - 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="p-4 bg-[#f7f7fb] rounded-lg border border-gray-200 mb-4">
                <span className="font-semibold text-[#6c47ff]">Q{current + 1}:</span>{" "}
                {questions[current]}
              </div>
              {mode === "text" ? (
                <textarea
                  className="w-full border rounded-lg px-3 py-2 min-h-[120px] bg-[#fafbff] placeholder:text-gray-400"
                  placeholder="Type your answer here..."
                  value={answers[current] || ""}
                  onChange={handleAnswerChange}
                  disabled={submitting}
                />
              ) : mode === "audio" ? (
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex-1 flex flex-col items-start gap-2">
                    <button
                      type="button"
                      onClick={listening ? stopListening : startListening}
                      className={`px-5 py-2 rounded-lg font-bold text-white shadow transition ${
                        listening ? "bg-red-500" : "bg-[#6c47ff] hover:bg-[#5433c6]"
                      }`}
                      disabled={submitting}
                    >
                      {listening
                        ? "Stop Listening"
                        : answers[current]
                        ? "Re-record Answer"
                        : "Start Speaking"}
                    </button>
                    {answers[current] && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800 w-full">
                        <span className="font-semibold">Transcript:</span> {answers[current]}
                      </div>
                    )}
                    {listening && (
                      <span className="text-red-500 font-semibold">Listening...</span>
                    )}
                  </div>
                </div>
              ) : mode === "video" ? (
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex-1 flex flex-col items-start gap-2">
                    <button
                      type="button"
                      onClick={listening ? stopListening : startListening}
                      className={`px-5 py-2 rounded-lg font-bold text-white shadow transition ${
                        listening ? "bg-red-500" : "bg-[#6c47ff] hover:bg-[#5433c6]"
                      }`}
                      disabled={submitting}
                    >
                      {listening
                        ? "Stop Listening"
                        : answers[current]
                        ? "Re-record Answer"
                        : "Start Speaking"}
                    </button>
                    {answers[current] && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800 w-full">
                        <span className="font-semibold">Transcript:</span> {answers[current]}
                      </div>
                    )}
                    {listening && (
                      <span className="text-red-500 font-semibold">Listening...</span>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col items-center">
                    <VideoRecorder submitting={submitting} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[#6c47ff] rounded-full transition-all"
                    style={{
                      width: `${((current + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              {current === questions.length - 1 && (
                <button
                  onClick={handleSubmit}
                  className="ml-6 px-6 py-2 rounded-lg bg-[#6c47ff] text-white font-bold shadow hover:bg-[#5433c6] transition"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Interview"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSessionPage;
