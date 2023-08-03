import express from 'express';
import mongoose from 'mongoose';
import { asyncRenderHandler } from '../utils/asyncHandler';
import Product from '../models/product';
import Category from '../models/category';
import User from '../models/user';
import { ERROR_PAGE } from '../../public/js/utils/constants';

const router = express.Router();

router.get(
  '/',
  asyncRenderHandler(async (req, res) => {
    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('subCategories');

    const recommendedProducts = await Product.find({ isRecommended: true })
      .populate('subCategories')
      .sort({ createdAt: -1 });

    res.render('home.ejs', {
      authStatus: req.user,
      newProducts,
      recommendedProducts,
      pageTitle: '잇북',
    });
  })
);

router.get(
  '/products/:mainCategory',
  asyncRenderHandler(async (req, res) => {
    const { mainCategory } = req.params;

    if (!['all', 'frontend', 'backend', 'cs'].includes(mainCategory)) {
      return res.status(404).render('error', ERROR_PAGE[404]);
    }

    const productFilter = mainCategory !== 'all' ? { mainCategory } : {};
    const categoryFilter = mainCategory !== 'all' ? { type: mainCategory } : {};
    const categoryMap = {
      all: '전체',
      frontend: '프론트엔드',
      backend: '백엔드',
      cs: 'CS',
    };
    const products = await Product.find(productFilter)
      .populate('subCategories')
      .sort({ createdAt: -1 });
    const subCategories = await Category.find(categoryFilter);
    res.render('product-list.ejs', {
      authStatus: req.user,
      products,
      title: categoryMap[mainCategory],
      pageTitle: `${categoryMap[mainCategory]} - 잇북`,
      subCategories,
      mainCategory,
    });
  })
);

router.get(
  '/product/:productId',
  asyncRenderHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.render('error', ERROR_PAGE[404]);
    }

    const product = await Product.findById(productId).populate('subCategories');

    if (!product) {
      return res.render('error', ERROR_PAGE[404]);
    }

    let isWishlist = false;

    if (req.user) {
      isWishlist = await User.exists({
        _id: req.user._id,
        wishList: productId,
      });
    }

    res.render('product-detail.ejs', {
      authStatus: req.user,
      product,
      isWishlist,
      pageTitle: `${product.title} - 잇북`,
    });
  })
);

router.get(
  '/cart',
  asyncRenderHandler(async (req, res) => {
    res.render('cart.ejs', {
      authStatus: req.user,
      pageTitle: `장바구니 - 잇북`,
    });
  })
);

export default router;
