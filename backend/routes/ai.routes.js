import { Router } from 'express';
import { getMasterAdvice, getRecoveryAdvice, getCalendar, getAgroforestry, getBioInput } from '../controllers/ai.controller.js';
import { processVoiceQuery } from '../services/ai.service.js';
import { getNearbyFarmingInfo } from '../services/ai.service.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/master', getMasterAdvice);
router.post('/recovery', getRecoveryAdvice);
router.post('/calendar', getCalendar);
router.post('/agroforestry', getAgroforestry);
router.post('/bio-inputs', getBioInput);
router.post('/voice', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return errorResponse(res, 'Transcript missing');
    const result = await processVoiceQuery(transcript);
    return successResponse(res, result, 'Voice query processed');
  } catch (error) {
    logger.error('Voice Route Error: ' + error.message);
    return errorResponse(res, 'Voice ai failed');
  }
});

router.post('/nearby-info', async (req, res) => {
  try {
    const { lat, lon, location } = req.body;
    const result = await getNearbyFarmingInfo(lat, lon, location);
    return successResponse(res, result, 'Nearby farming info generated');
  } catch (error) {
    logger.error('Nearby Info Error: ' + error.message);
    return errorResponse(res, 'Nearby info failed');
  }
});

export default router;
