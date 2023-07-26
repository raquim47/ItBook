import { Router } from 'express';
import {
  getAuthStatus,
  postLogin,
  postJoin,
  getCart,
  addToCart,
  mergeCarts,
} from '../controllers/auth';

const router = Router();

router.get('/api/auth/check', getAuthStatus);

router.post('/api/auth/login', postLogin);

router.post('/api/auth/join', postJoin);

router.get('/api/cart', getCart);

router.post('/api/cart', addToCart);

router.post('/api/cart/merge', mergeCarts);

export default router;
