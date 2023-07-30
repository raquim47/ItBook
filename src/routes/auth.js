import { Router } from 'express';
import {
  getAuthStatus,
  postLogin,
  postJoin,
  getCart,
  postToCart,
  postMergeCarts,
  getProduct,
  deleteFromCart,
  putCartItemQuantity
} from '../controllers/auth';

const router = Router();

router.get('/api/auth', getAuthStatus);

router.post('/api/login', postLogin);

router.post('/api/join', postJoin);

router.get('/api/cart', getCart);

router.post('/api/cart', postToCart);

router.post('/api/cart/merge', postMergeCarts);

router.get('/api/product/:productId', getProduct);

router.delete('/api/cart/:productId', deleteFromCart);

router.put('/api/cart/:productId/:direction', putCartItemQuantity);

export default router;
