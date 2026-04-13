import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { uploadSingle, uploadImage } from '../controllers/uploadController';

const router = Router();

router.use(authenticate);
router.post('/image', uploadSingle, uploadImage);

export default router;
