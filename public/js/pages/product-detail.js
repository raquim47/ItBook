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

const addToServerCart = async (item) => {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('장바구니에 상품을 추가하는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 로컬 스토래지 장바구니에 추가
const addToLocalStorageCart = (item) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(
    (product) => product.productId === item.productId
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.unshift(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
};

const onclickCartBtn = async (e) => {
  const isAuth = e.target.dataset.isAuth === 'true';
  const pathParts = window.location.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];
  const quantity = Number(document.getElementById('quantity').textContent);

  try {
    if (isAuth) {
      await addToServerCart({ productId, quantity });
    } else {
      addToLocalStorageCart({ productId, quantity });
    }

    const toastMessageContent = `
      <div class="toastMessage__contentLinked">
        <p>장바구니에 상품을 담았습니다.</p>
        <a href="/cart">장바구니로 이동 &gt;</a>
      </div>
    `;

    renderToastMessage(toastMessageContent);
  } catch (error) {
    renderToastMessage(
      '장바구니에 상품을 추가하는데 실패했습니다.',
      TOAST_TYPES.WARNING
    );
  }
};

const initializeModule = () => {
  setupHeader();
  bindEventsCountBtns();
  updateTotalPrice();
  const cartBtn = document.querySelector('.product-detail__cart-btn');
  cartBtn.addEventListener('click', onclickCartBtn);
};

initializeModule();
