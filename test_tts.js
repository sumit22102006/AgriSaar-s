import fetch from 'node-fetch';
import 'dotenv/config';

async function testTTS() {
  const apiKey = 'sk_4ad53c12f2d411d0f92090556a099c6ebfbd91b2b5576652';
  const VOICE_ID = 'fG9s0SXJb213f4UxVHyG'; // Ayesha
  
  console.log('Testing ElevenLabs API...');
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: 'Hello, I am a female voice from India.',
        model_id: 'eleven_multilingual_v2', // Try v2 instead of turbo for better quality
      }),
    });

    if (response.ok) {
      console.log('Success! Received audio stream.');
    } else {
      const err = await response.text();
      console.error('Error:', response.status, err);
    }
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}

testTTS();
