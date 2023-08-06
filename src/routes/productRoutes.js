import express from 'express';
import { asyncApiHandler } from '../utils/asyncHandler';
import Product from '../models/product';
import buildResponse from '../utils/build-response';
import { ERROR } from '../utils/constants';
import adminRequired from '../middlewares/admin-required';

const router = express.Router();

// 상품 전체 가져오기
router.get(
  '/api/products',
  asyncApiHandler(async (req, res) => {
    const products = await Product.find()
      .populate('subCategories')
      .sort({ createdAt: -1 });
    res.json(buildResponse(products));
  })
);

// 상품(상세) 가져오기
router.get(
  '/api/product/:productId',
  asyncApiHandler(async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    res.json(buildResponse(product));
  })
);

// 상품 등록
router.post(
  '/api/product',
  adminRequired,
  asyncApiHandler(async (req, res) => {
    const productData = req.body;
    const newProduct = await Product.create(productData);

    if (!newProduct) {
      return res.status(500).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    res.json(buildResponse());
  })
);

// 상품 수정
router.put(
  '/api/product/:productId',
  adminRequired,
  asyncApiHandler(async (req, res) => {
    const productId = req.params.productId;
    const updatedProductData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    res.json(buildResponse());
  })
);

// 상품 삭제
router.delete(
  '/api/product/:productId',
  adminRequired,
  asyncApiHandler(async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findByIdAndRemove(productId);

    if (!product) {
      return res.status(404).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    res.json(buildResponse());
  })
);

export default router;
