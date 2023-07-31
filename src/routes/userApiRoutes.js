import express from 'express';
import { asyncApiHandler } from '../utils/asyncHandler';
import buildResponse from '../utils/build-response';
import User from '../models/user';

const router = express.Router();

router.get(
  '/api/cart',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(buildResponse({ cart: user.cart.items }));
  })
);

router.post(
  '/api/cart',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { productId, quantity } = req.body;

    const cartProductIndex = user.cart.items.findIndex((cp) => {
      return cp.productId.toString() === productId.toString();
    });

    let newQuantity = quantity;
    const updatedCartItems = [...user.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = user.cart.items[cartProductIndex].quantity + quantity;
      updatedCartItems.splice(cartProductIndex, 1);
      updatedCartItems.unshift({ productId, quantity: newQuantity });
    } else {
      updatedCartItems.unshift({ productId, quantity: newQuantity });
    }

    user.cart = {
      items: updatedCartItems,
    };

    await user.save();
    res.json(buildResponse({ cart: user.cart.items }));
  })
);

router.post(
  '/api/cart/merge',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const localCartItems = req.body;
    
    for (const localItem of localCartItems.reverse()) {
      const cartItemIndex = user.cart.items.findIndex(
        (item) => item.productId == localItem.productId
      );
      if (cartItemIndex >= 0) {
        user.cart.items[cartItemIndex].quantity += localItem.quantity;
      } else {
        user.cart.items.unshift(localItem);
      }
    }

    await user.save();
    res.json(buildResponse({ cart: user.cart.items }));
  })
);

router.put(
  '/api/cart/:productId/:direction',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { productId, direction } = req.params;

    const cartItem = user.cart.items.find(
      (item) => item.productId == productId
    );
    if (!cartItem) {
      return res.status(400).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    let adjustment = direction === 'increase' ? 1 : -1;

    cartItem.quantity += adjustment;
    await user.save();

    res.json(buildResponse({ cart: user.cart.items }));
  })
);

router.delete(
  '/api/cart/:productId',
  asyncApiHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { productId } = req.params;

    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.productId == productId
    );

    if (cartItemIndex === -1) {
      return res.status(400).json(buildResponse(null, ERROR.PRODUCT_NOT_FOUND));
    }

    user.cart.items.splice(cartItemIndex, 1);
    await user.save();

    res.json(buildResponse({ cart: user.cart.items }));
  })
);

export default router;
