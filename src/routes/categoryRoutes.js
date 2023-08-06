import express from 'express';
import { asyncApiHandler } from '../utils/asyncHandler';
import Category from '../models/category';
import buildResponse from '../utils/build-response';

const router = express.Router();

router.get(
  '/api/category',
  asyncApiHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(buildResponse(categories));
  })
);

export default router;
