import express from 'express';
import bcrypt from 'bcrypt';
import { asyncApiHandler } from '../utils/asyncHandler';
import buildResponse from '../utils/build-response';
import User from '../models/user';
import Order from '../models/order';
import { ERROR } from '../../public/js/utils/constants';

const router = express.Router();

router.get(
  '/api/cart',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(buildResponse({ cart: user.cart }));
  })
);

router.post(
  '/api/cart',
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
    res.json(buildResponse({ cart: user.cart }));
  })
);

router.post(
  '/api/cart/merge',
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
    res.json(buildResponse({ cart: user.cart }));
  })
);

router.put(
  '/api/cart/:productId/:direction',
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

    res.json(buildResponse({ cart: user.cart }));
  })
);

// 장바구니 상품 여러개(배열) 삭제
router.delete(
  '/api/cart',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const productIds = req.body.productIds;
    user.cart = user.cart.filter(
      (item) => !productIds.includes(item.productId)
    );

    await user.save();
    console.log(user.cart);
    res.json(buildResponse({ cart: user.cart }));
  })
);

// 장바구니 상품 하나만 삭제
router.delete(
  '/api/cart/:productId',
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

    res.json(buildResponse({ cart: user.cart }));
  })
);

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

router.post(
  '/api/order',
  asyncApiHandler(async (req, res) => {
    const { products, address, phone, totalPrice } = req.body;

    const newOrder = new Order({
      products: products,
      userId: req.user._id,
      totalPrice: totalPrice,
      address: address,
      phone: phone,
    });

    await newOrder.save();

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

export default router;
