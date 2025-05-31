import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import heroImg from '../assets/heroimage.png';

const LandingPage = () => {
  return (
    <div className="bg-[#f7f7fb] min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="logo" className="h-7 w-7 cursor-pointer" onClick={() => window.location.href = '/dashboard'} />
          <span className="text-2xl font-extrabold text-[#6c47ff] tracking-tight cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
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
            href="#features"
            className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition"
          >
            Features
          </a>
          <a
            href="#packs"
            className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition"
          >
            Industry Packs
          </a>
          <a
            href="#faq"
            className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition"
          >
            FAQ
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
          <SignInButton mode="modal">
            <button className="px-6 py-2 rounded-lg bg-[#6c47ff] text-white font-semibold text-base shadow-md hover:bg-[#4f2fcf] transition">
              Get Started
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-16 md:py-24">
        <div className="flex-1 md:pr-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#6c47ff] leading-tight mb-2">
            Master Your Interview.
            <br />
            <span className="text-black">AI-Powered Prep for Success</span>
          </h1>
          <p className="text-lg text-gray-700 mt-6 mb-10 max-w-xl">
            Supercharge your interview performance with instant AI role fit
            analysis, real-time feedback, and domain-specific packs. Practice
            smarter, land your dream job.
          </p>
          <div className="flex gap-4 mt-2">
            <SignInButton mode="modal">
              <button className="px-7 py-3 rounded-lg bg-[#6c47ff] text-white font-bold text-lg shadow-lg hover:bg-[#4f2fcf] transition">
                Get Started Free
              </button>
            </SignInButton>
            {/* <SignInButton mode="modal">
              <button className="px-7 py-3 rounded-lg border border-[#d1d5db] bg-white text-[#6c47ff] font-bold text-lg shadow hover:bg-[#f3f0ff] transition">
                Sign In
              </button>
            </SignInButton> */}
          </div>
        </div>
        <div className="flex-1 flex justify-center mt-12 md:mt-0">
          <img
            src={heroImg}
            alt="AI Interview Hero"
            className="w-[400px] h-[400px] object-contain rounded-xl shadow-lg bg-white"
          />
        </div>
      </section>

      {/* Key Features Section - Enhanced for Eye Catching UX */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-[#6c47ff] mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 justify-items-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-start hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out min-w-[260px] min-h-[180px]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#6c47ff] text-3xl"><i className="fa-solid fa-file-shield"></i></span>
              <span className="font-bold text-xl text-gray-900">AI Role Fit Analysis</span>
            </div>
            <p className="text-gray-700 text-base">Upload your CV and Job Description to instantly see your match score, missing skills, and personalized improvement tips.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-start hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out min-w-[260px] min-h-[180px]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#6c47ff] text-3xl"><i className="fa-solid fa-video"></i></span>
              <span className="font-bold text-xl text-gray-900">Video AI Feedback</span>
            </div>
            <p className="text-gray-700 text-base">Get real-time feedback on eye contact, smiling, voice modulation, and filler words via your webcam. Instantly view improvement tips.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-start hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out min-w-[260px] min-h-[180px]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#6c47ff] text-3xl"><i className="fa-solid fa-boxes-stacked"></i></span>
              <span className="font-bold text-xl text-gray-900">Industry-Specific Packs</span>
            </div>
            <p className="text-gray-700 text-base">Practice with domain-tailored packs for Tech, Sales, Consulting, Data Science, BFSI, and more.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-start hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out min-w-[260px] min-h-[180px]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#6c47ff] text-3xl"><i className="fa-solid fa-microphone-lines"></i></span>
              <span className="font-bold text-xl text-gray-900">Voice-to-Text Comparison</span>
            </div>
            <p className="text-gray-700 text-base">Record your answers, auto-transcribe, and compare with ideal responses. Instantly spot missed keywords.</p>
          </div>
        </div>
      </section>

      {/* Industry Packs Section */}
      <section id="packs" className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-[#6c47ff] mb-10">Industry Packs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 justify-items-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-center min-w-[240px] min-h-[170px] hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out">
            <span className="text-[#6c47ff] text-5xl mb-4"><i className="fa-solid fa-laptop-code"></i></span>
            <span className="font-bold text-2xl text-gray-900 mb-2">Tech</span>
            <span className="text-gray-700 text-base text-center">Coding, system design & technical interviews</span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-center min-w-[240px] min-h-[170px] hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out">
            <span className="text-[#6c47ff] text-5xl mb-4"><i className="fa-solid fa-chart-line"></i></span>
            <span className="font-bold text-2xl text-gray-900 mb-2">Sales</span>
            <span className="text-gray-700 text-base text-center">Pitching, negotiation & closing skills</span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-center min-w-[240px] min-h-[170px] hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out">
            <span className="text-[#6c47ff] text-5xl mb-4"><i className="fa-regular fa-lightbulb"></i></span>
            <span className="font-bold text-2xl text-gray-900 mb-2">Consulting</span>
            <span className="text-gray-700 text-base text-center">Case, estimation, and behavioral rounds</span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-center min-w-[240px] min-h-[170px] hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out">
            <span className="text-[#6c47ff] text-5xl mb-4"><i className="fa-solid fa-database"></i></span>
            <span className="font-bold text-2xl text-gray-900 mb-2">Data Science</span>
            <span className="text-gray-700 text-base text-center">Analytics & ML interview prep</span>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 flex flex-col items-center min-w-[240px] min-h-[170px] hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out">
            <span className="text-[#6c47ff] text-5xl mb-4"><i className="fa-solid fa-building-columns"></i></span>
            <span className="font-bold text-2xl text-gray-900 mb-2">BFSI</span>
            <span className="text-gray-700 text-base text-center">Banking, finance, and insurance focus</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-4xl font-extrabold text-[#6c47ff] mb-10 text-center">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-7 items-center">
          {/* FAQ Item */}
          <details className="w-full max-w-2xl bg-[#f7f7fb] rounded-2xl border-2 border-gray-200 px-7 py-5 shadow-md group cursor-pointer transition-all duration-200 hover:border-[#6c47ff]">
            <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center cursor-pointer select-none">
              <span>How does the AI Role Fit Analysis work?</span>
              <svg className="w-6 h-6 text-[#6c47ff] ml-2 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="mt-3 text-gray-700 text-base leading-relaxed">
              Our AI analyzes your CV and job description to provide a match score, highlight missing skills, and offer personalized improvement tips for your target role.
            </div>
          </details>
          <details className="w-full max-w-2xl bg-[#f7f7fb] rounded-2xl border-2 border-gray-200 px-7 py-5 shadow-md group cursor-pointer transition-all duration-200 hover:border-[#6c47ff]">
            <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center cursor-pointer select-none">
              <span>Is my data and video feedback secure?</span>
              <svg className="w-6 h-6 text-[#6c47ff] ml-2 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="mt-3 text-gray-700 text-base leading-relaxed">
              Yes, your data is encrypted and stored securely. We never share your information without your consent.
            </div>
          </details>
          <details className="w-full max-w-2xl bg-[#f7f7fb] rounded-2xl border-2 border-gray-200 px-7 py-5 shadow-md group cursor-pointer transition-all duration-200 hover:border-[#6c47ff]">
            <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center cursor-pointer select-none">
              <span>Can I try it for free before subscribing?</span>
              <svg className="w-6 h-6 text-[#6c47ff] ml-2 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="mt-3 text-gray-700 text-base leading-relaxed">
              Absolutely! You can start with a free trial and unlock premium features anytime.
            </div>
          </details>
          <details className="w-full max-w-2xl bg-[#f7f7fb] rounded-2xl border-2 border-gray-200 px-7 py-5 shadow-md group cursor-pointer transition-all duration-200 hover:border-[#6c47ff]">
            <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center cursor-pointer select-none">
              <span>What industries are supported?</span>
              <svg className="w-6 h-6 text-[#6c47ff] ml-2 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="mt-3 text-gray-700 text-base leading-relaxed">
              We support Tech, Sales, Consulting, Data Science, BFSI, and more. New industry packs are added regularly.
            </div>
          </details>
        </div>
      </section>

      {/* Footer CTA Section */}
      <footer className="w-full bg-[#6c47ff] rounded-t-3xl py-12 px-6 mt-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-2">Ready to Ace Your Next Interview?</h3>
          <p className="text-white text-base md:text-lg opacity-90">Start your free trial today and unlock your potential with AI-powered prep.</p>
        </div>
        <SignInButton mode="modal">
          <button className="bg-white text-[#6c47ff] font-bold text-lg px-8 py-3 rounded-xl shadow hover:bg-[#f3f0ff] transition">Get Started</button>
        </SignInButton>
      </footer>

      {/* Footer Bottom Bar */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-4 bg-white border-t border-gray-200 text-sm mt-auto gap-2 fixed bottom-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#6c47ff]">© {new Date().getFullYear()} AI Interview Prep App</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-[#6c47ff]" aria-label="LinkedIn"><i className="fa-brands fa-linkedin text-lg"></i></a>
          <a href="#" className="text-gray-400 hover:text-[#6c47ff]" aria-label="Twitter"><i className="fa-brands fa-twitter text-lg"></i></a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;