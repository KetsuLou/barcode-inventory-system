import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllConfigs,
  getEnabledConfig,
  getConfigById,
  createConfig,
  updateConfig,
  deleteConfig,
  testConfig,
} from '../controllers/barcodeApiConfigController';

const router = express.Router();

router.get('/', authenticate, getAllConfigs);
router.get('/enabled', authenticate, getEnabledConfig);
router.get('/:id', authenticate, getConfigById);
router.post('/', authenticate, createConfig);
router.put('/:id', authenticate, updateConfig);
router.delete('/:id', authenticate, deleteConfig);
router.post('/:id/test', authenticate, testConfig);

export default router;