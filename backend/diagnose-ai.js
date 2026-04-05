import './config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './utils/logger.js';

async function diagnose() {
  console.log('--- AI DIAGNOSIS START ---');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API Key present:', !!process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is missing!');
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    console.log('Attempting Gemini call (gemini-1.5-flash)...');
    const result = await model.generateContent('Hello, respond with SUCCESS if you see this.');
    const response = await result.response;
    console.log('RESULT:', response.text());
    console.log('--- AI DIAGNOSIS SUCCESS ---');
  } catch (error) {
    console.error('--- AI DIAGNOSIS FAILED ---');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.stack) console.error('Stack:', error.stack);
  }
}

diagnose();
