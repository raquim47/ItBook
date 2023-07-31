import { ERROR } from '../../public/js/utils/constants';

// data 
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ cart: user.cart.items });
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

export const postMergeCarts = async (req, res) => {
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
    res.json({ cart: user.cart.items });
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

export const postToCart = async (req, res) => {
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
    res.json({ cart: user.cart.items });
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.params;

    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.productId == productId
    );

    if (cartItemIndex === -1) {
      return res.status(400).json(ERROR.PRODUCT_NOT_FOUND);
    }

    user.cart.items.splice(cartItemIndex, 1);
    await user.save();

    res.json({ cart: user.cart.items });
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

export const putCartItemQuantity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId, direction } = req.params;

    const cartItem = user.cart.items.find(
      (item) => item.productId == productId
    );
    if (!cartItem) {
      return res.status(400).json(ERROR.PRODUCT_NOT_FOUND);
    }

    let adjustment = direction === 'increase' ? 1 : -1;

    cartItem.quantity += adjustment;
    await user.save();

    res.json({ cart: user.cart.items });
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).json(ERROR.INTERNAL_ERROR);
  }
};

// page
export const renderOrderPage = (req, res) => {
  try {
    res.render('order.ejs', {
      authStatus: req.user,
      pageTitle: '주문서 - 잇북',
    });
  } catch (error) {
    console.error(ERROR.INTERNAL_ERROR.message, error.message);
    res.status(500).render('404.ejs', ERROR.INTERNAL_ERROR);
  }
};
