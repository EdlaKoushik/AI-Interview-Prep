
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Sleep utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple rate limiter: 1 request per second
const rateLimiter = {
  lastTokenTime: Date.now(),
  interval: 1000,
  waitForToken: async function () {
    const now = Date.now();
    const delay = this.interval - (now - this.lastTokenTime);
    if (delay > 0) await sleep(delay);
    this.lastTokenTime = Date.now();
  }
};

// Extract skills and experience from text
const extractKeywords = (text) => {
  if (!text) return '';

  const keywordPatterns = [
    /\b(?:JavaScript|Python|Java|C\+\+|Ruby|PHP|Swift|Kotlin|Go|Rust|SQL|HTML|CSS)\b/gi,
    /\b(?:React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|AWS|Azure|GCP)\b/gi,
    /\b(?:Docker|Kubernetes|Jenkins|Git|CI\/CD|DevOps|Agile|Scrum)\b/gi,
    /\b(?:Machine Learning|AI|Data Science|Cloud Computing|Microservices|REST API|GraphQL)\b/gi,
    /\b(?:MongoDB|PostgreSQL|MySQL|Redis|ElasticSearch|Firebase)\b/gi,
    /\b(?:Team Lead|Project Manager|Senior|Junior|Full Stack|Backend|Frontend|DevOps|SRE)\b/gi
  ];

  const experienceMatch = text.match(/\b\d+(?:\.\d+)?\s*(?:year|yr)s?\b/gi) || [];
  const keywords = keywordPatterns.reduce((acc, pattern) => {
    const matches = text.match(pattern) || [];
    return [...acc, ...matches];
  }, []);
  const uniqueKeywords = [...new Set(keywords)];
  const keySkills = uniqueKeywords.join(', ');
  const experience = experienceMatch.length ? `Experience: ${experienceMatch.join(', ')}. ` : '';

  return experience + (keySkills ? `Key skills: ${keySkills}` : '');
};

const processResumeText = (text) => {
  const keyInfo = extractKeywords(text);
  if (!keyInfo) return text.split(/\s+/).slice(0, 4).join(' ') + '...';

  const parts = keyInfo.split('Key skills:');
  const experience = parts[0].trim();
  const skills = parts[1] ? parts[1].trim() : '';

  const topSkills = skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);

  return experience.includes('Experience')
    ? `${experience} Main skill: ${topSkills[0] || ''}`
    : `Main skills: ${topSkills.join(', ')}`;
};

const processJobDescription = (text) => {
  const keyInfo = extractKeywords(text);
  if (!keyInfo) return text.split(/\s+/).slice(0, 4).join(' ') + '...';

  const parts = keyInfo.split('Key skills:');
  const skills = parts[1] ? parts[1].trim() : '';
  const topSkills = skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);

  return `Required skills: ${topSkills.join(', ')}`;
};

// Together AI API call
const generateQuestionsWithTogetherAI = async (prompt, apiKey, retryCount = 0) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  try {
    await rateLimiter.waitForToken();

    console.log('Attempting Together AI API call...');
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR assistant who creates interview questions based on candidate resumes and job descriptions.',
          },
          {
            role: 'user',
            content: prompt,
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.8,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('Together AI response:', JSON.stringify(response.data, null, 2));
    return response.data.choices[0].message.content.trim();

  } catch (error) {
    console.error('Together AI API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      const waitTime = (retryCount + 1) * RETRY_DELAY;
      console.log(`Rate limited. Retrying in ${waitTime / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(waitTime);
      return generateQuestionsWithTogetherAI(prompt, apiKey, retryCount + 1);
    }

    throw error;
  }
};

// Main exported function
export const generateQuestions = async (jobRole, industry, experience, jobDescription, resumeText) => {
  if (!process.env.TOGETHER_API_KEY) {
    throw new Error('Together AI API key not configured');
  }

  const processedResume = processResumeText(resumeText || '');
  const processedJobDesc = processJobDescription(jobDescription || '');

  let prompt = `Generate 5 interview questions for a ${experience} ${jobRole}`;
  if (industry) prompt += ` in the ${industry} industry.`;
  else prompt += '.';

  if (processedJobDesc) {
    prompt += ` Job Requirements: ${processedJobDesc}`;
  }

  if (processedResume) {
    prompt += `\nCandidate Background: ${processedResume}\nCustomise at least 2 questions to the candidate's background.`;
  }

  console.log('Generated prompt:', prompt);

  try {
    const text = await generateQuestionsWithTogetherAI(prompt, process.env.TOGETHER_API_KEY);

    let questions;
    if (text.includes('1.')) {
      questions = text.split(/\d+\.\s+/).filter(q => q.trim());
    } else if (text.includes('Q1:')) {
      questions = text.split(/Q\d+:\s+/).filter(q => q.trim());
    } else {
      questions = text.split('\n').filter(q => q.trim() && q.length > 10);
    }

    if (!questions.length) {
      throw new Error(`No questions extracted from response. Raw text: ${text}`);
    }

    const finalQuestions = questions
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, 5);

    console.log('Final generated questions:', finalQuestions);
    return finalQuestions;
  } catch (error) {
    console.error('Question generation failed:', error.message);
    throw error;
  }
};
