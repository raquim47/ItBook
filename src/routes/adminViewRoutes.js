import express from 'express';
import { asyncRenderHandler } from '../utils/asyncHandler';
import Product from '../models/product';

const router = express.Router();

router.get(
  '/admin/product/',
  asyncRenderHandler(async (req, res) => {
    const products = await Product.find()
      .populate('subCategories')
      .sort({ createdAt: -1 });
    res.render('admin-product', {
      authStatus: req.user,
      products,
      pageTitle: `상품관리 - 잇북`,
    });
  })
);

router.get(
  '/admin/product/add',
  asyncRenderHandler(async (req, res) => {
    // const products = await Product.find().populate('subCategories');
    res.render('admin-product-edit', {
      authStatus: req.user,
      pageTitle: `상품등록 - 잇북`,
    });
  })
);

export default router;
