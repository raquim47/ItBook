import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import Category from '../models/category';
import User from '../models/user';
import { asyncRenderHandler } from '../utils/asyncHandler';
import { ERROR_PAGE } from '../../public/js/utils/constants';
import loginRequired from '../middlewares/login-required';

const router = express.Router();

// 홈 페이지
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

// 상품 리스트 페이지
router.get(
  '/products/:mainCategory',
  asyncRenderHandler(async (req, res) => {
    const { mainCategory } = req.params;
    const categoryMap = {
      all: { db: '전체', display: '전체' },
      frontend: { db: 'FrontEnd', display: '프론트엔드' },
      backend: { db: 'BackEnd', display: '백엔드' },
      cs: { db: 'CS', display: 'CS' },
    };

    if (!categoryMap[mainCategory]) {
      return res.status(404).render('error', ERROR_PAGE[404]);
    }
    const productFilter =
      mainCategory !== 'all'
        ? { mainCategory: categoryMap[mainCategory].db }
        : {};
    const categoryFilter =
      mainCategory !== 'all' ? { type: categoryMap[mainCategory].db } : {};

    const products = await Product.find(productFilter)
      .populate('subCategories')
      .sort({ createdAt: -1 });

    const subCategories = await Category.find(categoryFilter);
    res.render('product-list.ejs', {
      authStatus: req.user,
      products,
      title: categoryMap[mainCategory].display,
      pageTitle: `${categoryMap[mainCategory].display} - 잇북`,
      subCategories,
    });
  })
);

// 상품 상세 페이지
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

// 장바구니 페이지
router.get(
  '/cart',
  asyncRenderHandler(async (req, res) => {
    res.render('cart.ejs', {
      authStatus: req.user,
      pageTitle: `장바구니 - 잇북`,
    });
  })
);

// 주문서 페이지
router.get(
  '/order',
  loginRequired,
  asyncRenderHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { username, email, address, phone } = user;

    res.render('order.ejs', {
      authStatus: req.user,
      userData: {
        username,
        email,
        address: address || '',
        phone: phone || '',
      },
      pageTitle: '주문서 - 잇북',
    });
  })
);

// 사용자 페이지 - 마이페이지/회원정보변경/주문내역/회원탈퇴
router.get(
  '/user/:section?',
  loginRequired,
  asyncRenderHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishList');
    const section = req.params.section || 'mypage';
    const sectionMap = {
      mypage: '마이페이지',
      edit: '회원정보 변경',
      order: '주문 내역',
      resign: '회원 탈퇴',
    };

    if (!Object.keys(sectionMap).includes(section)) {
      return res.status(404).render('error', ERROR_PAGE[404]);
    }
    res.render('user.ejs', {
      authStatus: req.user,
      userData: user,
      wishList: user.wishList,
      section,
      pageTitle: `${sectionMap[section]} - 잇북`,
    });
  })
);

// 관리자 페이지 - 상품 관리
router.get(
  '/admin/product/',
  asyncRenderHandler(async (req, res) => {
    res.render('admin-product', {
      authStatus: req.user,
      pageTitle: `상품관리 - 잇북`,
    });
  })
);

// 관리자 페이지 - 주문 관리
router.get(
  '/admin/order',
  asyncRenderHandler(async (req, res) => {
    res.render('admin-order', {
      authStatus: req.user,
      pageTitle: `주문관리 - 잇북`,
    });
  })
);

// 관리자 페이지 - 카테고리 관리
router.get(
  '/admin/category',
  asyncRenderHandler(async (req, res) => {
    res.render('admin-category', {
      authStatus: req.user,
      pageTitle: `카테고리관리 - 잇북`,
    });
  })
);

export default router;
