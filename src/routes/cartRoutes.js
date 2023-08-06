import express from 'express';
import { asyncApiHandler } from '../utils/asyncHandler';
import buildResponse from '../utils/build-response';
import User from '../models/user';
import { ERROR } from '../utils/constants';
import loginRequired from '../middlewares/login-required';

const router = express.Router();

router.get(
  '/api/cart',
  loginRequired,
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(buildResponse(user.cart));
  })
);

router.post(
  '/api/cart',
  loginRequired,
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { productId, quantity } = req.body;

    const cartProductIndex = user.cart.findIndex((cp) => {
      return cp.productId.toString() === productId.toString();
    });

    let newQuantity = quantity;
    const updatedCartItems = [...user.cart];

    if (cartProductIndex >= 0) {
      newQuantity = user.cart[cartProductIndex].quantity + quantity;
      updatedCartItems.splice(cartProductIndex, 1);
      updatedCartItems.unshift({ productId, quantity: newQuantity });
    } else {
      updatedCartItems.unshift({ productId, quantity: newQuantity });
    }

    user.cart = updatedCartItems;

    await user.save();
    res.json(buildResponse(user.cart));
  })
);

router.post(
  '/api/cart/merge',
  loginRequired,
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const localCartItems = req.body;

    for (const localItem of localCartItems.reverse()) {
      const cartItemIndex = user.cart.findIndex(
        (item) => item.productId == localItem.productId
      );
      if (cartItemIndex >= 0) {
        user.cart[cartItemIndex].quantity += localItem.quantity;
      } else {
        user.cart.unshift(localItem);
      }
    }

    await user.save();
    res.json(buildResponse(user.cart));
  })
);

router.put(
  '/api/cart/:productId/:direction',
  loginRequired,
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { productId, direction } = req.params;

    const cartItem = user.cart.find((item) => item.productId == productId);
    if (!cartItem) {
      return res.status(400).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    let adjustment = direction === 'increase' ? 1 : -1;

    cartItem.quantity += adjustment;
    await user.save();

    res.json(buildResponse(user.cart));
  })
);

// 장바구니 상품 여러개(배열) 삭제
router.delete(
  '/api/cart',
  loginRequired,
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const productIds = req.body.productIds;
    user.cart = user.cart.filter(
      (item) => !productIds.includes(item.productId)
    );

    await user.save();
    console.log(user.cart);
    res.json(buildResponse(user.cart));
  })
);

// 장바구니 상품 하나만 삭제
router.delete(
  '/api/cart/:productId',
  loginRequired,
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { productId } = req.params;

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId == productId
    );

    if (cartItemIndex === -1) {
      return res.status(400).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();

    res.json(buildResponse(user.cart));
  })
);

export default router;
