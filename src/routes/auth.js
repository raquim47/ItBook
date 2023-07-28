import { Router } from 'express';
import {
  getAuthStatus,
  postLogin,
  postJoin,
  getCart,
  addToCart,
  mergeCarts,
  getProduct,
  removeItem,
  adjustQuantity
} from '../controllers/auth';

const router = Router();

router.get('/api/auth/check', getAuthStatus);

router.post('/api/auth/login', postLogin);

router.post('/api/auth/join', postJoin);

router.get('/api/cart', getCart);

router.post('/api/cart', addToCart);

router.post('/api/cart/merge', mergeCarts);

router.get('/api/product/:productId', getProduct);

router.delete('/api/cart/:productId', removeItem);

router.put('/api/cart/:productId/:direction', adjustQuantity);

export default router;
