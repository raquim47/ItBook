import express from 'express';
import { asyncRenderHandler } from '../utils/asyncHandler';
import User from '../models/user';

const router = express.Router();

router.get(
  '/order',
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

router.get(
  '/user',
  asyncRenderHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('user.ejs', {
      authStatus: req.user,
      userData: {
        username: user.username,
      },
      pageTitle: `마이페이지 - 잇북`,
    });
  })
);
export default router;
