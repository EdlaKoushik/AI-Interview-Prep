import React from 'react';

const Upgrade = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f7f7fb] px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold text-[#6c47ff] mb-4">Upgrade to Premium</h2>
      <p className="text-gray-700 mb-6">Unlock unlimited interviews, advanced reports, and priority support with our premium plan.</p>
      <button className="bg-[#6c47ff] text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-[#4f2fcf] transition text-lg">Upgrade Now</button>
      <div className="mt-8 text-left">
        <h3 className="font-semibold text-lg mb-2">Billing History</h3>
        <div className="border-t border-gray-200 pt-3 mt-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <i className="fa-solid fa-file-invoice"></i> Invoice #2590
            <span className="ml-2">Free Trial</span>
            <span className="ml-2">May 1, 2025</span>
          </div>
        </div>
      </div>
    </div>
    <nav className="flex items-center justify-between px-4 md:px-12 py-5 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="logo" className="h-7 w-7 cursor-pointer" onClick={() => window.location.href = '/dashboard'} />
        <span className="text-2xl font-extrabold text-[#6c47ff] tracking-tight cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
          AI Interview Prep
        </span>
      </div>
      <div className="flex items-center gap-8">
        <a href="/dashboard" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Dashboard</a>
        <a href="/upgrade" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Upgrade</a>
        <a href="/settings" className="text-base font-medium text-gray-800 hover:text-[#6c47ff] transition">Settings</a>
      </div>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-6 py-2 rounded-lg border border-[#d1d5db] bg-white text-[#6c47ff] font-semibold text-base shadow-sm hover:bg-[#f3f0ff] transition">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  </div>
);

export default Upgrade;
