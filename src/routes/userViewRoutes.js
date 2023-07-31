import express from 'express';
import { asyncRenderHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get(
  '/order',
  asyncRenderHandler(async (req, res) => {
    res.render('order.ejs', {
      authStatus: req.user,
      pageTitle: '주문서 - 잇북',
    });
  })
);

export default router;
