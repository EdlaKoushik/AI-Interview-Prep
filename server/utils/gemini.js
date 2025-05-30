import axios from 'axios';

// Generate interview questions using Gemini API
export const generateQuestions = async (jobRole, industry, experience, jobDescription, resumeText) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    let prompt = `Generate 5 interview questions for a ${experience} ${jobRole} in ${industry}.`;
    if (jobDescription) {
      prompt += ` Job Description: ${jobDescription}`;
    }
    if (resumeText) {
      prompt += `\nResume Highlights: ${resumeText}\nCustomise at least 2 questions to the candidate's resume.`;
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = response.data.candidates[0].content.parts[0].text;
    const questions = text.split(/\d+\. /).filter(q => q.trim()).map(q => q.trim());

    if (questions.length === 0) {
      throw new Error('No questions generated');
    }

    return questions;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to generate interview questions');
  }
};

// Get AI feedback for a response
export const getFeedback = async (question, answer) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = `Evaluate the following answer to the interview question.\nQuestion: ${question}\nAnswer: ${answer}\nGive a short feedback and a score out of 100.`;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = response.data.candidates[0].content.parts[0].text;
    const scoreMatch = text.match(/score\s*:?\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

    if (!score) {
      throw new Error('Could not extract score from feedback');
    }

    return { text, score };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to generate feedback');
  }
};
