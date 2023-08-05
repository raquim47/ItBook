import express from 'express';
import { asyncRenderHandler } from '../utils/asyncHandler';
import Product from '../models/product';
import Order from '../models/order';

const router = express.Router();

router.get(
  '/admin/product/',
  asyncRenderHandler(async (req, res) => {
    res.render('admin-product', {
      authStatus: req.user,
      pageTitle: `상품관리 - 잇북`,
    });
  })
);

router.get(
  '/admin/order',
  asyncRenderHandler(async (req, res) => {
    res.render('admin-order', {
      authStatus: req.user,
      pageTitle: `주문관리 - 잇북`,
    });
  })
);

export default router;
