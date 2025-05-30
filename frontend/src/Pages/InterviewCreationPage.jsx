import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaFont, FaVideo, FaCheckCircle } from 'react-icons/fa';
import ResumeUpload from '../components/ResumeUpload';
import axios from 'axios';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";
import { useAuth } from "@clerk/clerk-react";
import { Toaster, toast } from "react-hot-toast";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const steps = [
  'Mode',
  'Job Details',
  'Resume & JD',
  'Summary',
];

const InterviewCreationPage = () => {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('text');
  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleResumeUpload = async (file) => {
    setResume(file);
    setError('');
    if (file && file.type === 'application/pdf') {
      try {
        setLoading(true);
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + ' ';
        }
        setResumeText(text.slice(0, 2000)); // Limit to 2000 chars for prompt
      } catch (err) {
        setError('Failed to extract text from PDF. Please ensure the PDF is not encrypted or scanned.');
        setResumeText('');
      } finally {
        setLoading(false);
      }
    } else {
      setResumeText('');
      setError('Please upload a valid PDF file.');
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setError('');

    // Show immediate feedback
    toast.loading('Starting interview...');

    // Validate required fields
    if (!role || !experience) {
      setError('Job role and experience level are required');
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Not authenticated. Please sign in.');
        throw new Error('Not authenticated. Please sign in.');
      }

      // 1. Create interview session
      const createRes = await axios.post('/api/interview/create', {
        mode,
        jobRole: role,
        industry,
        experience,
        jobDescription: jobDesc,
        resumeText,
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!createRes.data?.interview?._id) {
        toast.error('Failed to create interview session');
        throw new Error('Invalid response from server');
      }

      const interviewId = createRes.data.interview._id;
      toast.success('Interview created successfully!');

      // 2. Start interview (send resumeText for custom questions)
      const startRes = await axios.post('/api/interview/start', {
        interviewId,
        resumeText: resumeText || undefined,
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear any loading toasts
      toast.dismiss();
      
      // Show success toast and redirect
      toast.success('Interview started! Good luck!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff'
        },
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/interview-session/${interviewId}`);
      }, 1200);
    } catch (err) {
      console.error('Interview creation error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      // Clear any loading toasts
      toast.dismiss();

      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to start interview: ${errorMessage}`);
      
      // Show error toast
      toast.error(`Failed to start interview: ${errorMessage}`, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff'
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] flex flex-col items-center py-8 px-2 relative">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: '#4CAF50',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#f44336',
              color: '#fff',
            },
          },
          loading: {
            duration: 3000,
            style: {
              background: '#2196F3',
              color: '#fff',
            },
          },
        }}
      />
      {/* Top left Dashboard button */}
      <button
        className="absolute top-6 left-8 bg-[#6c47ff] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#5433c6] transition z-20"
        onClick={() => navigate('/dashboard')}
      >
        Go to Dashboard
      </button>

      {/* Stepper */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-10">
        {steps.map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-1 ${
              idx <= step ? 'bg-[#6c47ff]' : 'bg-gray-300'
            }`}>
              {idx < step ? <FaCheckCircle className="text-white" /> : idx + 1}
            </div>
            <span className={`text-xs font-medium ${idx <= step ? 'text-[#6c47ff]' : 'text-gray-400'}`}>{label}</span>
            {idx < steps.length - 1 && (
              <div className={`h-1 w-10 mt-1 ${idx < step ? 'bg-[#6c47ff]' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-8">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Select Interview Mode</h2>
            <div className="flex gap-6">
              <button
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition w-28 ${mode === 'text' ? 'border-[#6c47ff] bg-[#f3f0ff]' : 'border-gray-200 bg-white'} cursor-pointer`}
                onClick={() => setMode('text')}
              >
                <FaFont className="text-2xl" />
                <span>Text</span>
              </button>
              <button
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition w-28 ${mode === 'audio' ? 'border-[#6c47ff] bg-[#f3f0ff]' : 'border-gray-200 bg-white'} cursor-pointer`}
                onClick={() => setMode('audio')}
              >
                <FaMicrophone className="text-2xl" />
                <span>Audio</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 w-28 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                disabled
              >
                <FaVideo className="text-2xl" />
                <span>Video</span>
                <span className="text-xs">(Coming Soon)</span>
              </button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Job Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input type="text" className="w-full border rounded-lg px-3 py-2" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Software, Finance" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Job Role</label>
              <input type="text" className="w-full border rounded-lg px-3 py-2" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Frontend Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <select className="w-full border rounded-lg px-3 py-2" value={experience} onChange={e => setExperience(e.target.value)}>
                <option value="">Select</option>
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">3. Resume & Job Description</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Drag & Drop Resume Upload */}
              <div className="flex-1">
                <label className="block text-md font-semibold mb-2">Upload Resume (PDF)</label>
                <ResumeUpload onFile={handleResumeUpload} file={resume} />
                {loading && <div className="text-xs text-blue-600 mt-2">Extracting text from PDF...</div>}
                {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
              </div>
              {/* Job Description Paste */}
              <div className="flex-1">
                <label className="block text-md font-semibold mb-2">Paste Job Description</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 min-h-[160px] bg-[#fafbff] placeholder:text-gray-400"
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here..."
                />
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-6 text-[#6c47ff] flex items-center gap-2">
              <FaCheckCircle className="text-[#6c47ff] text-2xl" />
              Review & Confirm
            </h2>
            <div className="bg-[#f7f7fb] rounded-xl shadow-inner p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-lg">
                <span className="bg-[#f3f0ff] p-2 rounded-full"><FaFont className={`text-xl ${mode==='text' ? 'text-[#6c47ff]' : 'text-gray-400'}`} /></span>
                <span className="bg-[#f3f0ff] p-2 rounded-full"><FaMicrophone className={`text-xl ${mode==='audio' ? 'text-[#6c47ff]' : 'text-gray-400'}`} /></span>
                <span className="bg-[#f3f0ff] p-2 rounded-full"><FaVideo className="text-xl text-gray-300" /></span>
                <span className="ml-2 font-semibold">Mode:</span>
                <span className="capitalize text-[#6c47ff] font-bold">{mode}</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="bg-[#e6f9ed] p-2 rounded-full text-[#1db954] font-bold">🏢</span>
                <span className="font-semibold">Industry:</span>
                <span className="text-gray-700">{industry || <span className="italic text-gray-400">Not specified</span>}</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="bg-[#f3f0ff] p-2 rounded-full text-[#6c47ff] font-bold">💼</span>
                <span className="font-semibold">Role:</span>
                <span className="text-gray-700">{role || <span className="italic text-gray-400">Not specified</span>}</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="bg-[#fffbe6] p-2 rounded-full text-[#eab308] font-bold">⭐</span>
                <span className="font-semibold">Experience:</span>
                <span className="text-gray-700">{experience || <span className="italic text-gray-400">Not specified</span>}</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="bg-[#f3f0ff] p-2 rounded-full text-[#6c47ff] font-bold">📄</span>
                <span className="font-semibold">Resume:</span>
                <span className={resume ? "text-green-600 font-semibold" : "text-gray-400 italic"}>{resume ? resume.name : 'Not uploaded'}</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="bg-[#f3f0ff] p-2 rounded-full text-[#6c47ff] font-bold">📝</span>
                <span className="font-semibold">Job Description:</span>
                <span className={jobDesc ? "text-[#6c47ff] font-semibold" : "text-gray-400 italic"}>{jobDesc ? 'Provided' : 'Not provided'}</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <span className="inline-block bg-[#e6f9ed] text-[#1db954] px-4 py-2 rounded-full font-semibold text-md shadow">Ready to start your interview? Click below!</span>
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            className="px-5 py-2 rounded-lg border bg-gray-100 text-gray-600 font-semibold disabled:opacity-50 cursor-pointer"
            onClick={handleBack}
            disabled={step === 0}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              className="px-5 py-2 rounded-lg bg-[#6c47ff] text-white font-semibold hover:bg-[#5433c6] transition cursor-pointer"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="px-5 py-2 rounded-lg bg-[#6c47ff] text-white font-semibold cursor-pointer hover:bg-[#5433c6] transition "
              onClick={handleStartInterview}
            >
              Start Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCreationPage;





