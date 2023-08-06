import express from 'express';
import bcrypt from 'bcrypt';
import { asyncApiHandler } from '../utils/asyncHandler';
import buildResponse from '../utils/build-response';
import User from '../models/user';
import { ERROR } from '../../public/js/utils/constants';

const router = express.Router();

// 유저 정보 수정
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

// 유저 삭제 (탈퇴)
router.delete(
  '/api/user',
  asyncApiHandler(async (req, res) => {
    if (req.user.isAdmin) {
      return res
        .status(403)
        .json(buildResponse(null, ERROR.ADMIN_DELETE_NOT_ALLOWED));
    }
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

// 찜한 상품 저장
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
