import setupHeader from '../components/header.js';
import { TOAST_TYPES } from '../utils/constants.js';
import renderToastMessage from '../components/toast-message.js';

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

const saveToLocalStorage = (item) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(
    (product) => product.productId === item.productId
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
};

const onclickCartBtn = (e) => {
  const isAuth = e.target.dataset.isAuth === 'true';
  
  const pathParts = window.location.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];
  const quantity = Number(document.getElementById('quantity').textContent);

  if (isAuth) {
    saveToServer({ productId, quantity });
  } else {
    saveToLocalStorage({ productId, quantity });
  }
  const toastMessageContent = `
    <div class="toastMessage__contentLinked">
      <p>장바구니에 상품을 담았습니다.</p>
      <a href="/cart">장바구니로 이동 &gt;</a>
    </div>
  ` 
  renderToastMessage(toastMessageContent)
};

const initializeModule = () => {
  setupHeader();
  bindEventsCountBtns();
  updateTotalPrice();
  const cartBtn = document.querySelector('.product-detail__cart-btn');
  cartBtn.addEventListener('click', onclickCartBtn);
};

initializeModule();
