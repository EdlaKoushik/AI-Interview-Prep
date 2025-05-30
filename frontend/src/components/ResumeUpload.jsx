import React from 'react';

const ResumeUpload = ({ onFile, file }) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 min-h-[160px] bg-[#fafbff] cursor-pointer transition hover:border-[#6c47ff] ${file ? 'border-[#6c47ff]' : 'border-gray-300'}`}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={e => {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          onFile(e.dataTransfer.files[0]);
        }
      }}
      onClick={() => document.getElementById('resume-upload-input').click()}
    >
      <input
        id="resume-upload-input"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={e => onFile(e.target.files[0])}
      />
      <div className="flex flex-col items-center">
        <span className="text-3xl text-[#6c47ff] mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
          </svg>
        </span>
        {file ? (
          <span className="text-green-600 font-medium">{file.name}</span>
        ) : (
          <>
            <span className="text-gray-600 font-medium">Drag & drop your file or <span className="text-[#6c47ff] underline cursor-pointer">Browse</span></span>
            <span className="text-xs text-gray-400 mt-1">PDF only, max 2MB</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
