import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import showToast from '../components/toast-message.js';
import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import orderService from '../services/order-service.js';
import productService from '../services/product-service.js';
import userService from '../services/user-service.js';
import bindAddressSearch from '../utils/bindAddressSearch.js';
import {
  DELIVERY,
  ERROR,
  LOCAL_STORAGE_KEYS,
  SUCCESS,
  TOAST_TYPES,
} from '../utils/constants.js';

// 로컬스토래지에서 주문 데이터 가져오기
const getOrderFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDER_ITEMS));
};

// 주문 가격 렌더링
const renderPaymentPrice = (productAmount) => {
  const orderAmountEl = document.querySelector('#orderAmount');
  const deliveryFeeEl = document.querySelector('#deliveryFee');
  const orderPriceEl = document.querySelector('#orderPrice');
  const { FEE, FREE_THRESHOLD } = DELIVERY;
  const deliveryFee = Number(productAmount) >= FREE_THRESHOLD ? 0 : FEE;
  orderAmountEl.textContent = `${Number(productAmount).toLocaleString()}원`;
  deliveryFeeEl.textContent = `+${deliveryFee.toLocaleString()}원`;
  orderPriceEl.textContent = `${(
    Number(productAmount) + deliveryFee
  ).toLocaleString()}원`;
};

// 주문 상품 렌더링
const renderOrderItems = async (products) => {
  const tbody = document.querySelector('.table tbody');

  for (const product of products) {
    const result = await productService.requestGetProduct(
      product.productId,
      'title'
    );

    if (result.error) {
      showToast(result.error);
      continue;
    }

    const title = result.data;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${title}</td><td>${product.quantity}</td>`;
    tbody.appendChild(tr);
  }
};

// 주문 동의 체크박스 이벤트 바인딩
const bindAgreeAll = () => {
  document.querySelector('#agreeAll').addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    document.querySelector('#agreePaymentInfo').checked = isChecked;
    document.querySelector('#agreePrivacy').checked = isChecked;
  });
};

// 페이지를 떠날 때 주문데이터(로컬 스토래지) 삭제
const resetOrderItems = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ORDER_ITEMS);
};

// 주문 데이터(로컬 스토래지)가 없을 때 리다이렉트
const handleInvalidAccess = () => {
  const toastContent = `
      <div class="toastMessage__content">
        <p>잘못된 접근입니다.</p>
        <p>장바구니페이지로 이동합니다.</p>
      </div>`;
  showToast(toastContent);
  setTimeout(() => (window.location.href = '/cart'), 2000);
};

// 주문 폼 제출 유효성 검사
const validateForm = () => {
  const address = document.querySelector('#address').value.trim();
  const phone = document.querySelector('#phone').value.trim();

  if (!address || !phone) {
    showToast(ERROR.ADDREDD_PHONE_REQUIRED.message);
    return false;
  }

  const pattern = /^010-\d{4}-\d{4}$/;
  if (!pattern.test(phone)) {
    showToast(ERROR.PHONE_INVALID.message);
    return false;
  }

  // 동의 사항 체크 확인
  const isAgreePaymentInfo =
    document.querySelector('#agreePaymentInfo').checked;
  const isAgreePrivacy = document.querySelector('#agreePrivacy').checked;
  if (!isAgreePaymentInfo || !isAgreePrivacy) {
    showToast(ERROR.AGREEMENT_REQUIRED);
    return false;
  }

  return true;
};

const constructOrderData = (orderData) => {
  const deliveryCharge =
    Number(orderData.productAmount) <= DELIVERY.FREE_THRESHOLD
      ? DELIVERY.FEE
      : 0;
  const totalPrice = Number(orderData.productAmount) + deliveryCharge;
  const formData = new FormData(document.querySelector('#orderForm'));
  const address = formData.get('address');
  const phone = formData.get('phone');

  return { address, phone, totalPrice, products: orderData.products };
};

const updateUserInfo = async (address, phone) => {
  const result = await userService.requestPutUserInfo({ address, phone });
  if (result.error) return showToast(result.error);
};

const deleteCartItems = async (products) => {
  const productIds = products.map((product) => product.productId);
  const result = await cartService.requestDeleteMultipleFromCart(productIds);

  if (result.error) {
    return showToast(result.error);
  }
};

const postOrder = async (data) => {
  const result = await orderService.requestPostOrder(data);
  if (result.error) {
    return showToast(result.error);
  }

  showToast(SUCCESS.ORDER, TOAST_TYPES.SUCCESS);

  setTimeout(() => (location.href = '/user/order'), 2500);
};

// 주문 폼 제출
const bindOrderSubmitBtn = (orderData) => {
  document
    .querySelector('#orderSubmitBtn')
    .addEventListener('click', async () => {
      if (!validateForm()) return;

      const data = constructOrderData(orderData);

      if (document.getElementById('setDefault').checked) {
        await updateUserInfo(data.address, data.phone);
      }

      if (orderData.fromCart) {
        await deleteCartItems(data.products);
      }

      await postOrder(data);
    });
};

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();

  const orderData = getOrderFromLocalStorage();
  if (!orderData) {
    handleInvalidAccess();
  }

  renderOrderItems(orderData.products);
  renderPaymentPrice(orderData.productAmount);
  bindAddressSearch();
  bindAgreeAll();
  bindOrderSubmitBtn(orderData);
  window.addEventListener('unload', resetOrderItems);
};

initPage();
