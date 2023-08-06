// indexRoutes.js
import express from 'express';
import authRoutes from './authRoutes';
import cartRoutes from './cartRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';
import userRoutes from './userRoutes';
import viewRoutes from './viewRoutes';
import { ERROR_PAGE } from '../../public/js/utils/constants';

const router = express.Router();

router.use(authRoutes);
router.use(cartRoutes);
router.use(categoryRoutes);
router.use(orderRoutes);
router.use(productRoutes);
router.use(userRoutes);
router.use(viewRoutes);

// 404
router.use((req, res) => {
  res.status(404).render('error', ERROR_PAGE[404]);
});

export default router;
