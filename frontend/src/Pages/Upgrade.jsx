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
  </div>
);

export default Upgrade;
