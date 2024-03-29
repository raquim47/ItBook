import express from 'express';
import User from '../models/user';
import setUserToken from '../utils/set-user-token';
import hashPassword from '../utils/hash-password';
import bcrypt from 'bcrypt';
import buildResponse from '../utils/build-response';
import { asyncApiHandler } from '../utils/asyncHandler';
import { ERROR } from '../utils/constants';

const router = express.Router();

// 로그인 상태 가져오기
router.get(
  '/api/auth',
  asyncApiHandler(async (req, res) => {
    const authStatus = req.user
      ? { isAuth: true, isAdmin: req.user.isAdmin }
      : { isAuth: false, isAdmin: false };

    res.json(buildResponse(authStatus));
  })
);

// 로그인
router.post(
  '/api/login',
  asyncApiHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(buildResponse(null, ERROR.EMAIL_NOT_FOUND));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json(buildResponse(null, ERROR.PASSWORD_INVALID));
    }

    setUserToken(res, user);
    const authStatus = { isAuth: true, isAdmin: user.isAdmin };
    res.json(buildResponse(authStatus));
  })
);

// 회원가입
router.post(
  '/api/join',
  asyncApiHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    const hashedPassword = await hashPassword(password);

    if (existingUser) {
      return res.status(400).json(buildResponse(null, ERROR.EMAIL_DUPLICATE));
    }

    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.json(buildResponse());
  })
);

export default router;
