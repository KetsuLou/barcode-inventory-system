import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getAllProducts,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';

const router = Router();

router.use(authenticate);

router.get('/', getAllProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.post('/', [
  body('barcode').notEmpty().withMessage('Barcode is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
], createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
