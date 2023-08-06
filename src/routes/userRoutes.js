import express from 'express';
import bcrypt from 'bcrypt';
import { asyncApiHandler } from '../utils/asyncHandler';
import buildResponse from '../utils/build-response';
import User from '../models/user';
import { ERROR } from '../../public/js/utils/constants';

const router = express.Router();

router.put(
  '/api/user',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { username, address, phone } = req.body;

    if (username) user.username = username;
    user.address = address || '';
    user.phone = phone || '';

    await user.save();
    res.json(buildResponse());
  })
);

router.delete(
  '/api/user',
  asyncApiHandler(async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json(buildResponse(null, ERROR.PASSWORD_INVALID));
    }
    await User.deleteOne({ _id: user._id });
    res.json(buildResponse());
  })
);

router.put(
  '/api/user/wishlist/:productId',
  asyncApiHandler(async (req, res) => {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    if (user.wishList.includes(productId)) {
      // 찜 해제
      user.wishList = user.wishList.filter((id) => id.toString() !== productId);
    } else {
      // 찜하기
      user.wishList.push(productId);
    }
    await user.save();
    res.json(buildResponse());
  })
);

export default router;
