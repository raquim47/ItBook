import setUserToken from '../utils/set-user-token';
import hashPassword from '../utils/hash-password';
import User from '../models/user';
import bcrypt from 'bcrypt';

export const getAuthStatus = (req, res) => {
  try {
    if (req.user) {
      res.json({ authStatus: { isAuth: true, isAdmin: !!req.user.isAdmin } });
    } else {
      res.json({ authStatus: { isAuth: false, isAdmin: false } });
    }
  } catch (error) {
    console.error('인증 요청에 실패했습니다.', error.message);
    res.status(500);
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'EMAIL_NOT_FOUND',
        message: '등록되지 않은 이메일입니다.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'INVALID_PASSWORD',
        message: '비밀번호가 올바르지 않습니다.',
      });
    }

    setUserToken(res, user);
    return res.status(200).json({
      message: '로그인에 성공했습니다.',
      authStatus: { isAuth: true, isAdmin: !!user.isAdmin },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: '로그인에 실패했습니다.',
    });
  }
};

export const postJoin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    const hashedPassword = await hashPassword(password);

    if (existingUser) {
      return res.status(400).json({
        error: 'DUPLICATE_EMAIL',
        message: '이미 존재하는 이메일입니다.',
      });
    }

    await User.create({
      email,
      username,
      password: hashedPassword,
    });
    
    return res.json({ 
      message: '회원가입이 완료되었습니다.' 
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: '회원가입 중 오류가 발생했습니다.',
    });
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
    console.log(user, localCartItems)
    for (const localItem of localCartItems.reverse()) { 
      const cartItemIndex = user.cart.items.findIndex((item) => item.productId == localItem.productId);
      if (cartItemIndex >= 0) {
        user.cart.items[cartItemIndex].quantity += localItem.quantity;
      } else {
        user.cart.items.unshift(localItem); 
      }
    }

    await user.save();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '요청을 처리하는 도중 문제가 발생했습니다.' });
  }
};

export const addToCart = async (req, res) => {
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
  res.json(user);
};