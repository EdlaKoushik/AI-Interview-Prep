import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaMicrophone, FaFont, FaHistory, FaCalendarAlt, FaClock } from 'react-icons/fa';
import toggleImg from '../assets/toggle.png';
import plusImg from '../assets/plus.png';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f7f7fb] min-h-screen font-sans flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-12 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="logo" className="h-7 w-7" />
          <span className="text-2xl font-extrabold text-[#6c47ff] tracking-tight">AI Interview Prep App</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="/" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Home</a>
          <a href="/upgrade" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Upgrade</a>
          <a href="/settings" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Settings</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="ml-2 p-2 rounded-full  hover:bg-[#e0d7ff] transition cursor-pointer" aria-label="Toggle dark mode">
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
              <FaVideo className="mr-2" /> Start Now
            </button>
          </div>
        </div>

        {/* Past Interviews */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[#6c47ff] font-semibold text-lg mb-4 mt-2">
            <FaHistory />
            Past Interviews
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Video Interview Card */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 min-w-[260px]">
              <div className="flex items-center gap-2 mb-2">
               
                <span className="font-bold text-lg text-gray-900">Frontend Interview</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-1">
                <FaCalendarAlt /> May 24, 2025
                <FaClock className="ml-2" /> 14:00
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#e6f9ed] text-[#1db954] font-bold px-3 py-1 rounded-lg text-xs">Score: 87%</span>
                <span className="text-gray-500 text-xs">"Excellent clarity and confidence, minor filler words"</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="bg-white border border-[#6c47ff] text-[#6c47ff] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#f3f0ff] transition flex-1">Feedback Report</button>
                <button className="bg-[#6c47ff] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#4f2fcf] transition flex-1">Retake</button>
              </div>
            </div>
            {/* Audio Interview Card */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 min-w-[260px]">
              <div className="flex items-center gap-2 mb-2">
                
                <span className="font-bold text-lg text-gray-900">Full stack Interview</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-1">
                <FaCalendarAlt /> May 15, 2025
                <FaClock className="ml-2" /> 10:30
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#fffbe6] text-[#eab308] font-bold px-3 py-1 rounded-lg text-xs">Score: 71%</span>
                <span className="text-gray-500 text-xs">"Good articulation, but improve on answering speed"</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="bg-white border border-[#6c47ff] text-[#6c47ff] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#f3f0ff] transition flex-1">Feedback Report</button>
                <button className="bg-[#6c47ff] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#4f2fcf] transition flex-1">Retry</button>
              </div>
            </div>
            {/* Text Interview Card */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 min-w-[260px]">
              <div className="flex items-center gap-2 mb-2">
                
                <span className="font-bold text-lg text-gray-900">Backend Interview</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-1">
                <FaCalendarAlt /> May 2, 2025
                <FaClock className="ml-2" /> 18:10
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#f3f0ff] text-[#6c47ff] font-bold px-3 py-1 rounded-lg text-xs">Score: 94%</span>
                <span className="text-gray-500 text-xs">"Outstanding! Answers are precise & relevant."</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="bg-white border border-[#6c47ff] text-[#6c47ff] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#f3f0ff] transition flex-1">Feedback Report</button>
                <button className="bg-[#6c47ff] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#4f2fcf] transition flex-1">Retry</button>
              </div>
            </div>
          </div>
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



