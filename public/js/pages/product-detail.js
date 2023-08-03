import setupHeader from '../components/header.js';
import { ERROR, LOCAL_STORAGE_KEYS, TOAST_TYPES } from '../utils/constants.js';
import renderToastMessage from '../components/toast-message.js';
import cartService from '../services/cart-service.js';
import authService from '../services/auth-service.js';

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

const onclickAddCartBtn = async (e) => {
  const pathParts = window.location.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];
  const quantity = Number(document.getElementById('quantity').textContent);

  const result = await cartService.requestPostToCart({ productId, quantity });
  if (result.error) {
    renderToastMessage(result.error);
    return;
  }
  const toastMessageContent = `
      <div class="toastMessage__content">
        <p>장바구니에 상품을 담았습니다.</p>
        <a href="/cart">장바구니로 이동 &gt;</a>
      </div>
    `;

  renderToastMessage(toastMessageContent, TOAST_TYPES.SUCCESS);
};

const onClickBuyBtn = () => {
  if(!authService.isAuth){
    renderToastMessage(ERROR.AUTH_REQUIRED)
    return;
  }

  const pathParts = window.location.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];
  const quantity = Number(document.getElementById('quantity').textContent);

  const productAmount = document
    .querySelector('#totalPrice')
    .textContent.replace(/[,\s원]/g, '');
  
  const data = {
    products: [{productId, quantity}],
    productAmount,
    fromCart : false,
  };
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDER_ITEMS, JSON.stringify(data));
  location.href = '/order';
}

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  bindEventsCountBtns();
  updateTotalPrice();
  const addCartBtn = document.querySelector('.product-detail__cart-btn');
  const buyBtn = document.querySelector('.product-detail__buy-btn');
  addCartBtn.addEventListener('click', onclickAddCartBtn);
  buyBtn.addEventListener('click', onClickBuyBtn)
};

initPage();
