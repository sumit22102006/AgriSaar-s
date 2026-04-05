import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { SEASONS } from '../utils/constants.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  for (const [key, season] of Object.entries(SEASONS)) {
    if (season.months.includes(month)) return { key, ...season };
  }
  return { key: 'rabi', ...SEASONS.rabi };
}

export async function recommendCrops(soilData, location, season) {
  const currentSeason = season || getCurrentSeason();
  const seasonLabel = typeof currentSeason === 'string' ? currentSeason : currentSeason.label;

  const prompt = `You are a crop advisor for farmers. Respond ONLY in English. Use simple and clear terms.

SOIL DATA:
- Nitrogen: ${soilData.nitrogen} kg/ha
- Phosphorus: ${soilData.phosphorus} kg/ha
- Potassium: ${soilData.potassium} kg/ha
- pH: ${soilData.ph}
- Organic Carbon: ${soilData.organicCarbon || 'N/A'}%

LOCATION: ${location || 'India'}
SEASON: ${seasonLabel}

TASK:
Give top 3 best crops, 2 rotation crops with benefits, and 1 market trend prediction. 

OUTPUT FORMAT: Return ONLY valid JSON inside a code block, exactly like this:
{
  "topCrops": [
    { "name": "Wheat", "score": 90, "reason": "Perfect for balanced NPK." }
  ],
  "rotationCrops": [
    { "name": "Legumes", "benefit": "Fixes nitrogen in soil" }
  ],
  "marketTrends": "Wheat prices are expected to rise by 5% this season due to high demand."
}`;

  try {
    logger.ai('Calling Gemini for crop recommendation...');
    const response = await model.generateContent(prompt);
    
    // Parse the JSON blocks out of the markdown response
    const rawText = response.response.text();
    const jsonMatch = rawText.match(/```(?:json)?\n([\s\S]*?)\n```/) || rawText.match(/{[\s\S]*}/);
    const resultJson = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : null;
    
    if (resultJson) {
      return resultJson;
    }
    throw new Error('Invalid JSON from Gemini');
  } catch (error) {
    logger.error(`Gemini crop recommendation error: ${error.message}`);
    const fallbackData = generateFallbackCrops(soilData, seasonLabel);
    return fallbackData;
  }
}

function generateFallbackCrops(soil, season) {
  let topCrops = [];
  const isBalanced = soil.nitrogen >= 200 && soil.phosphorus >= 15 && soil.potassium >= 150;

  if (isBalanced) {
    topCrops = [
      { name: 'Wheat', score: 85, reason: 'Good balanced NPK levels' },
      { name: 'Rice', score: 75, reason: 'Sufficient nutrients for paddy' },
      { name: 'Maize', score: 65, reason: 'Decent conditions for generic crops' }
    ];
  } else if (soil.nitrogen < 140) {
    topCrops = [
      { name: 'Green Gram', score: 88, reason: 'Legume helps fix low nitrogen' },
      { name: 'Gram', score: 80, reason: 'Needs very low nitrogen' },
      { name: 'Lentil', score: 70, reason: 'Drought resistant and low N requirement' }
    ];
  } else {
    topCrops = [
      { name: 'Pearl Millet', score: 80, reason: 'Tolerant to harsh soil conditions' },
      { name: 'Sorghum', score: 75, reason: 'Hardy crop for imbalanced soil' },
      { name: 'Pigeon Pea', score: 60, reason: 'Deep rooting crop' }
    ];
  }

  return {
    topCrops,
    rotationCrops: [
      { name: 'Mustard', benefit: 'Breaks pest cycle' },
      { name: 'Cowpea', benefit: 'Improves soil organic carbon' }
    ],
    marketTrends: 'Market prices generally look stable for these hardy resilient crops.'
  };
}
