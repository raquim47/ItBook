import express from 'express';
import {
  getCart,
  postToCart,
  postMergeCarts,
  deleteFromCart,
  putCartItemQuantity,
  renderOrderPage,
} from '../controllers/memberController';

const router = express.Router();
// data

router.get('/api/cart', getCart);

router.post('/api/cart', postToCart);

router.post('/api/cart/merge', postMergeCarts);

router.delete('/api/cart/:productId', deleteFromCart);

router.put('/api/cart/:productId/:direction', putCartItemQuantity);

// page

router.get('/order', renderOrderPage);
export default router;
