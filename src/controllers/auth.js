import setUserToken from '../utils/set-user-token';
import hashPassword from '../utils/hash-password';
import User from '../models/user';
import Product from '../models/product';
import bcrypt from 'bcrypt';
import { ERROR, SUCCESS } from '../../public/js/utils/constants';

export const getAuthStatus = (req, res) => {
  try {
    if (req.user) {
      res.json({ isAuth: true, isAdmin: !!req.user.isAdmin });
    } else {
      res.json({ isAuth: false, isAdmin: false });
    }
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(ERROR.EMAIL_NOT_FOUND);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json(ERROR.PASSWORD_INVALID);
    }

    setUserToken(res, user);
    return res.status(200).json({
      ...SUCCESS.LOGIN,
      isAuth: true,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

export const postJoin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    const hashedPassword = await hashPassword(password);

    if (existingUser) {
      return res.status(400).json(ERROR.EMAIL_DUPLICATE);
    }

    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.json(SUCCESS.JOIN);
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

export const getCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.cart.items);
};

export const mergeCarts = async (req, res) => {
  try {
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
    res.status(200).json(user.cart.items); // 합쳐진 cart 데이터 반환
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: '요청을 처리하는 도중 문제가 발생했습니다.' });
  }
};

export const addToCart = async (req, res) => {
  try {
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
    res.json(user.cart.items);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: '상품을 장바구니에 추가하는데 실패했습니다.' });
  }
};

export const getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeItem = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.params;

    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.productId == productId
    );

    if (cartItemIndex === -1) {
      return res.status(400).json({ message: '상품을 찾을 수 없습니다' });
    }

    user.cart.items.splice(cartItemIndex, 1);
    await user.save();

    res.json(user.cart.items);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

export const adjustQuantity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId, direction } = req.params;

    const cartItem = user.cart.items.find(
      (item) => item.productId == productId
    );
    if (!cartItem) {
      return res.status(400).json({ message: '장바구니 정보를 찾을 수 없음' });
    }

    let adjustment = direction === 'increase' ? 1 : -1;

    cartItem.quantity += adjustment;
    await user.save();

    res.json(user.cart.items);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};
