// import axios from 'axios';

// // Token bucket rate limiter implementation
// class RateLimiter {
//   constructor(tokensPerInterval, intervalInMs) {
//     this.tokensPerInterval = tokensPerInterval;
//     this.intervalInMs = intervalInMs;
//     this.tokens = tokensPerInterval;
//     this.lastRefill = Date.now();
//   }

//   async waitForToken() {
//     this._refillTokens();
    
//     if (this.tokens < 1) {
//       const waitTime = this._timeUntilNextRefill();
//       console.log(`Rate limit prevention: Waiting ${Math.ceil(waitTime/1000)} seconds before next request...`);
//       await new Promise(resolve => setTimeout(resolve, waitTime));
//       this._refillTokens();
//     }
    
//     this.tokens -= 1;
//     return true;
//   }

//   _refillTokens() {
//     const now = Date.now();
//     const timePassed = now - this.lastRefill;
//     const tokensToAdd = Math.floor(timePassed / this.intervalInMs * this.tokensPerInterval);
    
//     if (tokensToAdd > 0) {
//       this.tokens = Math.min(this.tokensPerInterval, this.tokens + tokensToAdd);
//       this.lastRefill = now;
//     }
//   }

//   _timeUntilNextRefill() {
//     const now = Date.now();
//     const timePassed = now - this.lastRefill;
//     const intervalsPassed = Math.ceil(timePassed / this.intervalInMs);
//     const nextRefill = this.lastRefill + (intervalsPassed * this.intervalInMs);
//     return nextRefill - now;
//   }
// }

// // Create a rate limiter: 50 requests per minute (leaving some buffer from the 60 limit)
// const rateLimiter = new RateLimiter(50, 60 * 1000);

// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // Extract key skills and technologies from text
// const extractKeywords = (text) => {
//   if (!text) return '';
  
//   // Common technical skills and keywords to look for
//   const keywordPatterns = [
//     /\b(?:JavaScript|Python|Java|C\+\+|Ruby|PHP|Swift|Kotlin|Go|Rust|SQL|HTML|CSS)\b/gi,
//     /\b(?:React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|AWS|Azure|GCP)\b/gi,
//     /\b(?:Docker|Kubernetes|Jenkins|Git|CI\/CD|DevOps|Agile|Scrum)\b/gi,
//     /\b(?:Machine Learning|AI|Data Science|Cloud Computing|Microservices|REST API|GraphQL)\b/gi,
//     /\b(?:MongoDB|PostgreSQL|MySQL|Redis|ElasticSearch|Firebase)\b/gi,
//     /\b(?:Team Lead|Project Manager|Senior|Junior|Full Stack|Backend|Frontend|DevOps|SRE)\b/gi
//   ];

//   // Extract years of experience
//   const experienceMatch = text.match(/\b\d+(?:\.\d+)?\s*(?:year|yr)s?\b/gi) || [];
  
//   // Extract all matching keywords
//   const keywords = keywordPatterns.reduce((acc, pattern) => {
//     const matches = text.match(pattern) || [];
//     return [...acc, ...matches];
//   }, []);

//   // Remove duplicates and combine
//   const uniqueKeywords = [...new Set(keywords)];
//   const keySkills = uniqueKeywords.join(', ');
  
//   // Combine experience and skills
//   const experience = experienceMatch.length ? `Experience: ${experienceMatch.join(', ')}. ` : '';
//   return experience + (keySkills ? `Key skills: ${keySkills}` : '');
// };

// // Process resume text to extract relevant information
// const processResumeText = (text) => {
//   if (!text) return '';
  
//   // Extract key information
//   const keyInfo = extractKeywords(text);
  
//   if (keyInfo) {
//     // Split into parts
//     const parts = keyInfo.split('Key skills:');
//     const experience = parts[0].trim();
//     const skills = parts[1] ? parts[1].trim() : '';

//     // Get the most important skills (max 3)
//     const topSkills = skills.split(',')
//       .map(s => s.trim())
//       .filter(s => s)
//       .slice(0, 3);

//     // Combine with experience if available
//     const finalText = experience.includes('Experience') ? 
//       `${experience} Main skill: ${topSkills[0] || ''}` :
//       `Main skills: ${topSkills.join(', ')}`;

//     return finalText;
//   }
  
//   // If no structured info found, just take first few words
//   const words = text.split(/\s+/).slice(0, 4).join(' ');
//   return words + (text.split(/\s+/).length > 4 ? '...' : '');
// };

// // Process job description to extract key requirements
// const processJobDescription = (text) => {
//   if (!text) return '';
  
//   // Extract key information
//   const keyInfo = extractKeywords(text);
  
//   if (keyInfo) {
//     // Split into parts
//     const parts = keyInfo.split('Key skills:');
//     const skills = parts[1] ? parts[1].trim() : '';

//     // Get the most important skills (max 4)
//     const topSkills = skills.split(',')
//       .map(s => s.trim())
//       .filter(s => s)
//       .slice(0, 4);

//     return `Required skills: ${topSkills.join(', ')}`;
//   }
  
//   // If no structured info found, just take first few words
//   const words = text.split(/\s+/).slice(0, 4).join(' ');
//   return words + (text.split(/\s+/).length > 4 ? '...' : '');
// };

// const generateQuestionsWithGemini = async (prompt, apiKey, retryCount = 0) => {
//   const MAX_RETRIES = 3;
//   const RETRY_DELAY = 2000; // 2 seconds

//   try {
//     // Wait for rate limiter to allow the request
//     await rateLimiter.waitForToken();
    
//     console.log('Attempting Gemini API call...');
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
//       {
//         contents: [{
//           parts: [{
//             text: prompt
//           }]
//         }],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.8,
//           maxOutputTokens: 1024,
//         }
//       },
//       {
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );
//     console.log('Gemini API response:', JSON.stringify(response.data, null, 2));
//     return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
//   } catch (error) {
//     console.error('Detailed Gemini API Error:', {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status
//     });

//     if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
//       const waitTime = (retryCount + 1) * RETRY_DELAY;
//       console.log(`Rate limited. Retrying in ${waitTime/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
//       await sleep(waitTime);
//       return generateQuestionsWithGemini(prompt, apiKey, retryCount + 1);
//     }

//     if (error.response?.status === 429) {
//       throw new Error(
//         'The API is currently experiencing high traffic. Please try one of the following:\n' +
//         '1. Wait a few minutes and try again\n' +
//         '2. Try with a shorter job description or resume text\n' +
//         '3. If the issue persists, try at a different time'
//       );
//     }

//     throw error;
//   }
// };

// export const generateQuestions = async (jobRole, industry, experience, jobDescription, resumeText) => {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error('Gemini API key not configured');
//   }

//   // Process and extract key information from inputs
//   const processedJobDesc = processJobDescription(jobDescription);
//   const processedResume = processResumeText(resumeText);

//   console.log('Processed job description:', processedJobDesc);
//   console.log('Processed resume:', processedResume);

//   let prompt = `Generate 5 interview questions for a ${experience} ${jobRole} in ${industry}.`;
//   if (processedJobDesc) {
//     prompt += ` Job Requirements: ${processedJobDesc}`;
//   }
//   if (processedResume) {
//     prompt += `\nCandidate Background: ${processedResume}\nCustomise at least 2 questions to the candidate's background.`;
//   }

//   console.log('Generated prompt:', prompt);
  
//   try {
//     const text = await generateQuestionsWithGemini(prompt, process.env.GEMINI_API_KEY);
//     if (!text) {
//       throw new Error('No response from Gemini API');
//     }

//     // Parse the response into questions
//     let questions;
//     if (text.includes('1.')) {
//       questions = text.split(/\d+\.\s+/).filter(q => q.trim());
//     } else if (text.includes('Q1:')) {
//       questions = text.split(/Q\d+:\s+/).filter(q => q.trim());
//     } else {
//       questions = text.split('\n').filter(q => q.trim() && q.length > 10);
//     }

//     if (!questions.length) {
//       throw new Error(`No questions extracted from response. Raw text: ${text}`);
//     }

//     // Clean up questions and take only the first 5
//     const finalQuestions = questions
//       .map(q => q.trim())
//       .filter(q => q.length > 0)
//       .slice(0, 5);

//     console.log('Final generated questions:', finalQuestions);
//     return finalQuestions;
//   } catch (error) {
//     console.error('Question generation failed:', error.message);
//     throw error;
//   }
// };
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
