import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function testAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API KEY MISSING');
    process.exit(1);
  }
  
  console.log('Testing with key:', apiKey.substring(0, 5) + '...');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  try {
    const result = await model.generateContent('Say Hello in Hindi strictly.');
    const response = await result.response;
    console.log('SUCCESS:', response.text());
  } catch (error) {
    console.error('FAILURE:', error);
  }
}

testAI();
