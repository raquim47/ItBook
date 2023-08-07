import express from 'express';
import { asyncApiHandler } from '../utils/asyncHandler';
import Category from '../models/category';
import buildResponse from '../utils/build-response';
import { ERROR } from '../utils/constants';
import adminRequired from '../middlewares/admin-required';

const router = express.Router();

// 카테고리 전체 가져오기
router.get(
  '/api/categories',
  asyncApiHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(buildResponse(categories));
  })
);

// 카테고리 한 개 가져오기
router.get(
  '/api/category/:categoryId',
  asyncApiHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json(buildResponse(null, ERROR.CATEGORY_NOT_FOUND));
    }

    res.json(buildResponse(category));
  })
);

// 카테고리 등록
router.post(
  '/api/category',
  adminRequired,
  asyncApiHandler(async (req, res) => {
    const categoryData = req.body;

    const existingCategory = await Category.findOne({ 
      name: categoryData.name, 
      type: categoryData.type 
    });
    if (existingCategory) {
      return res.status(400).json(buildResponse(null, ERROR.DUPLICATE_CATEGORY));
    }

    const newCategory = await Category.create(categoryData);

    if (!newCategory) {
      return res
        .status(500)
        .json(buildResponse(null, ERROR.CATEGORY_NOT_FOUND));
    }

    res.json(buildResponse());
  })
);

// 카테고리 name (소분류) 수정
router.put(
  '/api/category/:categoryId',
  adminRequired,
  asyncApiHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const updatedCategoryData = { name: req.body.name };

    const existingCategory = await Category.findOne({ 
      name: updatedCategoryData.name, 
      type: req.body.type 
    });
    if (existingCategory && existingCategory._id !== categoryId) {
      return res.status(400).json(buildResponse(null, ERROR.DUPLICATE_CATEGORY));
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedCategoryData,
      { new: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json(buildResponse(null, ERROR.CATEGORY_NOT_FOUND));
    }

    res.json(buildResponse());
  })
);

// 카테고리 삭제
router.delete(
  '/api/category/:categoryId',
  adminRequired,
  asyncApiHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const category = await Category.findByIdAndRemove(categoryId);

    if (!category) {
      return res
        .status(404)
        .json(buildResponse(null, ERROR.CATEGORY_NOT_FOUND));
    }

    res.json(buildResponse());
  })
);
export default router;
