import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHistory, FaCalendarAlt, FaClock } from 'react-icons/fa';
import toggleImg from '../assets/toggle.png';
import plusImg from '../assets/plus.png';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await axios.get('/api/interview/all', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        console.log('Fetched interviews:', res.data.interviews); // Debug log
        setInterviews(res.data.interviews || []);
      } catch (err) {
        console.error('Error fetching interviews:', err); // Debug log
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [getToken]);

  return (
    <div className="bg-[#f7f7fb] min-h-screen font-sans flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-12 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="logo" className="h-7 w-7 cursor-pointer" onClick={() => window.location.href = '/dashboard'} />
          <span className="text-2xl font-extrabold text-[#6c47ff] tracking-tight cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
            AI Interview Prep App
          </span>
        </div>
        <div className="flex items-center gap-8">
          <a href="/dashboard" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Dashboard</a>
          <a href="/upgrade" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Upgrade</a>
          <a href="/settings" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Settings</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="ml-2 p-2 rounded-full hover:bg-[#e0d7ff] transition cursor-pointer" aria-label="Toggle dark mode">
            <img src={toggleImg} alt="toggle" className="w-7 h-7 object-contain" />
          </button>
          <SignedOut >
            <SignInButton mode="modal">
              <button className="px-6 py-2 rounded-lg border border-[#d1d5db] bg-white text-[#6c47ff] font-semibold text-base shadow-sm hover:bg-[#f3f0ff] transition ">Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Create New Interview */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="bg-[#f3f0ff] text-[#6c47ff] rounded-full p-3 flex items-center justify-center cursor-pointer">
                <img src={plusImg} alt="plus" className="w-7 h-7 object-contain" />
              </span>
              <div>
                <div className="font-bold text-lg text-gray-900">Create New Interview</div>
                <div className="text-gray-500 text-sm">Start a new mock interview with AI tailored to your job role</div>
              </div>
            </div>
            <button 
              className="bg-[#6c47ff] text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-[#4f2fcf] transition text-lg flex items-center gap-2"
              onClick={() => navigate('/create-interview')}
            >
              Start Now
            </button>
          </div>
        </div>

        {/* Past Interviews */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[#6c47ff] font-semibold text-lg mb-4 mt-2">
            <FaHistory />
            Past Interviews
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : interviews.length === 0 ? (
            <div>No interviews found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {interviews.map((interview) => {
                // Calculate score and feedback summary if available
                let score = 0;
                let summary = '';
                if (Array.isArray(interview.answers) && interview.answers.length > 0) {
                  const answered = interview.answers.filter(a => a && a.length > 0).length;
                  score = Math.round((answered / (interview.questions?.length || 1)) * 100);
                }
                if (Array.isArray(interview.feedback) && interview.feedback.length > 0) {
                  summary = interview.feedback.find(f => f && f.length > 0) || '';
                } else if (interview.overallFeedback) {
                  summary = interview.overallFeedback;
                }
                // Date/time formatting
                const created = new Date(interview.createdAt);
                const dateStr = created.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                const timeStr = created.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
                return (
                  <div
                    key={interview._id}
                    className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 hover:shadow-lg transition"
                  >
                    <div className="font-bold text-xl text-gray-900 mb-2">{interview.jobRole || 'Interview'}</div>
                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-1">
                      <FaCalendarAlt /> {dateStr}
                      <FaClock className="ml-2" /> {timeStr}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#e6f9ed] text-[#1db954] font-bold px-3 py-1 rounded-lg text-xs">Score: {score}%</span>
                      <span className="text-gray-500 text-xs">{summary ? `"${summary}"` : ''}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-white border border-[#6c47ff] text-[#6c47ff] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#f3f0ff] transition flex-1"
                        onClick={() => navigate(`/feedback/${interview._id}`)}
                      >
                        Feedback Report
                      </button>
                      <button
                        className="bg-[#6c47ff] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#4f2fcf] transition flex-1"
                        onClick={() => navigate(`/interview-session/${interview._id}`)}
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-4 bg-white border-t border-gray-200 text-sm mt-auto gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#6c47ff]">© 2025 AI Interview Prep App</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-[#6c47ff]" aria-label="LinkedIn"><i className="fa-brands fa-linkedin text-lg"></i></a>
          <a href="#" className="text-gray-400 hover:text-[#6c47ff]" aria-label="Twitter"><i className="fa-brands fa-twitter text-lg"></i></a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;



