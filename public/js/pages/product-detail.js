import setupHeader from '../components/header.js';
import { ERROR, LOCAL_STORAGE_KEYS, TOAST_TYPES } from '../utils/constants.js';
import showToast from '../components/toast-message.js';
import cartService from '../services/cart-service.js';
import authService from '../services/auth-service.js';
import userService from '../services/user-service.js';

// 총 금액 업데이트
const updateTotalPrice = (quantity = 1) => {
  const productPrice = Number(
    document.getElementById('productPrice').dataset.price
  );
  const totalPrice = productPrice * quantity;

  const totalPriceElement = document.getElementById('totalPrice');
  totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;
};

// 수량 조절
const adjustQuantity = (e) => {
  const quantityElement = document.getElementById('quantity');
  let quantity = Number(quantityElement.textContent);

  if (e.target.id === 'increaseBtn') {
    quantity++;
  } else if (e.target.id === 'decreaseBtn' && quantity > 1) {
    quantity--;
  }

  quantityElement.textContent = quantity;
  updateTotalPrice(quantity);
};

// 수량 버튼 이벤트 바인딩
const bindEventsCountBtns = () => {
  const decreaseBtn = document.getElementById('decreaseBtn');
  const increaseBtn = document.getElementById('increaseBtn');

  decreaseBtn.addEventListener('click', adjustQuantity);
  increaseBtn.addEventListener('click', adjustQuantity);
};

const bindWishlistBtn = () => {
  const wishlistBtn = document.querySelector('.product-detail__wishlist-btn');
  wishlistBtn.addEventListener('click', async (e) => {
    const currentBtn = e.currentTarget;
    const productId = window.location.pathname.split('/').pop();
    const result = await userService.putUserWishlist(productId);
    if (result.error) return;
    currentBtn.classList.toggle('active');
  });
};

const bindCartBtn = () => {
  const cartBtn = document.querySelector('.product-detail__cart-btn');
  cartBtn.addEventListener('click', async () => {
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    const quantity = Number(document.getElementById('quantity').textContent);

    const result = await cartService.postToCart({ productId, quantity });
    console.log(result);
    if (result.error) return;

    const toastContent = `
        <div class="toastMessage__content">
          <p>장바구니에 상품을 담았습니다.</p>
          <a href="/cart">장바구니로 이동 &gt;</a>
        </div>
      `;

    showToast(toastContent, TOAST_TYPES.SUCCESS);
  });
};

const bindBuyBtn = () => {
  const buyBtn = document.querySelector('.product-detail__buy-btn');
  buyBtn.addEventListener('click', () => {
    if (!authService.isAuth) {
      showToast(ERROR.AUTH_REQUIRED);
      return;
    }

    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    const quantity = Number(document.getElementById('quantity').textContent);

    const productAmount = document
      .querySelector('#totalPrice')
      .textContent.replace(/[,\s원]/g, '');

    const data = {
      products: [{ productId, quantity }],
      productAmount,
      fromCart: false,
    };
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDER_ITEMS, JSON.stringify(data));
    location.href = '/order';
  });
};

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  bindEventsCountBtns();
  updateTotalPrice();

  bindWishlistBtn();
  bindCartBtn();
  bindBuyBtn();
};

initPage();
