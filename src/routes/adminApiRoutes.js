import express from 'express';
import { asyncApiHandler } from '../utils/asyncHandler';
import Category from '../models/category';
import Product from '../models/product';
import buildResponse from '../utils/build-response';

const router = express.Router();

router.get(
  '/api/products',
  asyncApiHandler(async (req, res) => {
    const products = await Product.find().populate('subCategories').sort({ createdAt: -1 });
    
    res.json(buildResponse({ products }));
  })
);

router.get(
  '/api/category',
  asyncApiHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(buildResponse({ categories }));
  })
);

router.post(
  '/api/product',
  asyncApiHandler(async (req, res) => {
    const productData = req.body;
    const newProduct = await Product.create(productData);

    if (!newProduct) {
      return res
        .status(500)
        .json(buildResponse(null, ERROR.PRODUCT_CREATION_FAILED));
    }

    res.json(buildResponse());
  })
);

// 상품 수정 API
router.put(
  '/api/product/:productId',
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

router.delete(
  '/api/product/:productId',
  asyncApiHandler(async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findByIdAndRemove(productId)

    if (!product) {
      return res.status(404).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    res.json(buildResponse());
  })
);

export default router;
