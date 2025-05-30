import React from 'react';

const Settings = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f7f7fb] px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold text-[#6c47ff] mb-4">Settings</h2>
      <p className="text-gray-700 mb-6">Personalize your experience</p>
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-800 font-medium">Dark Mode</span>
        <label className="inline-flex relative items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#6c47ff] transition"></div>
        </label>
      </div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-800 font-medium">Profile</span>
        <button className="bg-[#f3f0ff] text-[#6c47ff] font-semibold px-4 py-1 rounded-lg shadow hover:bg-[#e0d7ff] transition">Manage</button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-800 font-medium">Sign Out</span>
        <button className="bg-white border border-[#6c47ff] text-[#6c47ff] font-semibold px-4 py-1 rounded-lg shadow hover:bg-[#f3f0ff] transition">Log Out</button>
      </div>
    </div>
  </div>
);

export default Settings;
