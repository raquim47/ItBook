import express from 'express';
import Product from '../models/product';
import User from '../models/user';
import setUserToken from '../utils/set-user-token';
import hashPassword from '../utils/hash-password';
import bcrypt from 'bcrypt';
import buildResponse from '../utils/build-response';
import { asyncApiHandler } from '../utils/asyncHandler';
import { ERROR } from '../../public/js/utils/constants';

const router = express.Router();

// data
router.get(
  '/api/auth',
  asyncApiHandler(async (req, res) => {
    const authStatus = req.user
      ? { isAuth: true, isAdmin: req.user.isAdmin }
      : { isAuth: false, isAdmin: false };

    res.json(buildResponse(authStatus));
  })
);

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

export default router;
