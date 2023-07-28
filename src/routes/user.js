import express from 'express';
import {
  getUser,
  updateUser,
  deleteUser,
  addToCart,
  getCart,
  clearCart,
  removeItem,
  mergeCarts,
  adjustQuantity
} from '../controllers/user';
import apiLoginRequired from '../middlewares/api-login-required';

const router = express.Router();

router.get('/api/user', getUser);

router.post('/api/user/', apiLoginRequired, updateUser);

router.delete('/api/user/:id/', apiLoginRequired, deleteUser);

router.get('/api/user/cart', apiLoginRequired, getCart);


router.post('/api/user/cart/merge', apiLoginRequired, mergeCarts);

router.delete('/api/user/cart/:id', apiLoginRequired, removeItem);
router.put('/api/user/cart/:id/:direction', apiLoginRequired, adjustQuantity);

router.post('/api/user/cart', apiLoginRequired, addToCart);

router.delete('/api/cart/all/:uid', apiLoginRequired, clearCart);

export default router;
