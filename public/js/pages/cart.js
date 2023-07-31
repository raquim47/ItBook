import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import renderToastMessage from '../components/toast-message.js';
import productService from '../services/product-service.js';
import {
  CUSTOM_EVENT,
  TOAST_TYPES,
  DELIVERY,
  ERROR,
  LOCAL_STORAGE_KEYS,
} from '../utils/constants.js';

let savedCheckedProductIds = [];
let isInitialRender = true;

// 체크 박스 상태 저장
const saveCheckedState = () => {
  const checkedItems = document.querySelectorAll(
    '.cart-checkbox:checked:not(#allCheck)'
  );
  return Array.from(checkedItems).map(
    (checkbox) => checkbox.closest('.cart-item').dataset.productId
  );
};

// renderCartList 이후 체크 박스 재설정
const restoreCheckedState = (productIds) => {
  const allCartItems = document.querySelectorAll('.cart-item');

  allCartItems.forEach((cartItem) => {
    const productId = cartItem.dataset.productId;
    const checkBox = cartItem.querySelector('.cart-checkbox');

    if (productIds.includes(productId)) {
      checkBox.checked = true;
    } else {
      checkBox.checked = false;
    }
  });
};

const createCartItemHTML = (item) => {
  return `
    <li class="cart-item" data-product-id="${item._id}">
      <div class="cart-item__checkbox">
        <input type="checkbox" class="cart-checkbox" checked />
      </div>
      <div class="cart-item__info">
        <a href="#">
          <img class="cart-item__img" src="${item.imageUrl}" alt="도서 사진" />
          <div class="cart-item__text">
            <h3 class="cart-item__title">${item.title}</h3>
            <p class="cart-item__author">${item.author}</p>
          </div>
        </a>
      </div>
      <div class="cart-item__option">
        <div class="count-control">
          <button type="button" class="count-control__btn" data-direction="decrease">-</button>
          <input class="count-control__status" id="itemQuantity" readonly value="${
            item.quantity
          }" />
          <button type="button" class="count-control__btn"  data-direction="increase">+</button>
        </div>
        <strong class="cart-item__price" id="itemPrice">${(
          item.price * item.quantity
        ).toLocaleString()} 원</strong>
      </div>
      <div class="cart-item__delete">
        <button type="button" class="x-btn" aria-label="상품 삭제"></button>
      </div>
    </li>`;
};

const renderCartItem = async (item) => {
  const data = await productService.requestGetProduct(item.productId);

  if (!data.success) {
    renderToastMessage(data.message, TOAST_TYPES.WARNING);
    return;
  }

  const cartItem = {
    ...data.product,
    quantity: item.quantity,
  };

  return createCartItemHTML(cartItem);
};

// 장바구니 리스트 렌더링 (초기 & 데이터가 업데이트 될 때 마다)
const renderCartList = async () => {
  const cartList = document.getElementById('cartList');
  const cartData = cartService.cart;
  const cartItemsHTMLPromises = cartData.map((item) => renderCartItem(item));
  const cartItemsHTMLArray = await Promise.all(cartItemsHTMLPromises);

  cartList.innerHTML = cartItemsHTMLArray.join('');

  if (isInitialRender) {
    isInitialRender = false;
    return;
  }
  // 첫 렌더링이 아닐 땐 체크 박스 상태 복구
  restoreCheckedState(savedCheckedProductIds);
};

// 수량 변경/품목 삭제
const onClickCartForm = async (e) => {
  const target = e.target;
  if (target.classList.contains('count-control__btn')) {
    savedCheckedProductIds = saveCheckedState();
    const productId = target.closest('.cart-item').dataset.productId;
    const direction = target.dataset.direction;

    if (direction === 'decrease') {
      const currentItem = cartService.cart.find(
        (item) => item.productId === productId
      );
      if (currentItem.quantity <= 1) {
        return;
      }
    }

    const data = await cartService.requestPutCartItemQuantity(
      productId,
      direction
    );
    if (!data.success) {
      renderToastMessage(data.message, TOAST_TYPES.WARNING);
    }
  }

  if (target.classList.contains('x-btn')) {
    savedCheckedProductIds = saveCheckedState();
    const productId = target.closest('.cart-item').dataset.productId;
    const data = await cartService.requestDeleteFromCart(productId);

    if (!data.success) {
      renderToastMessage(data.messge, TOAST_TYPES.WARNING);
    }
  }
};

// 주문 금액 계산
const renderTotalPrice = () => {
  const checkedItems = document.querySelectorAll(
    '.cart-checkbox:checked:not(#allCheck)'
  );

  let totalPrice = 0;

  checkedItems.forEach((checkbox) => {
    const cartItem = checkbox.closest('.cart-item');
    const quantity = Number(cartItem.querySelector('#itemQuantity').value);
    const itemPrice =
      Number(
        cartItem.querySelector('#itemPrice').textContent.replace(/[,\s원]/g, '')
      ) / quantity;
    totalPrice += itemPrice * quantity;
  });

  const { FEE, FREE_THRESHOLD } = DELIVERY;
  const deliveryCharge =
    totalPrice === 0 ? 0 : totalPrice >= FREE_THRESHOLD ? 0 : FEE;
  const productAmountEl = document.getElementById('productAmount');
  const deliveryFeeEl = document.getElementById('deliveryFee');
  const totalAmountEl = document.getElementById('totalPrice');

  productAmountEl.textContent = `${totalPrice.toLocaleString()}원`;
  deliveryFeeEl.textContent = `+${deliveryCharge.toLocaleString()}원`;
  totalAmountEl.textContent = `${(
    totalPrice + deliveryCharge
  ).toLocaleString()}원`;
};

// 선택한 품목 갯수 표시
const renderSelectStatus = () => {
  const checkBoxes = document.querySelectorAll('.cart-checkbox:not(#allCheck)');
  const checkedBoxes = document.querySelectorAll(
    '.cart-checkbox:checked:not(#allCheck)'
  );

  selectStatus.textContent = `${checkedBoxes.length}/${checkBoxes.length}`;
};

// 체크박스 이벤트
const onChangeCheckBox = (e) => {
  const target = e.target;

  if (target.type !== 'checkbox') return;
  const allCheckBox = document.getElementById('allCheck');
  const itemCheckBoxes = document.querySelectorAll(
    '.cart-checkbox:not(#allCheck)'
  );

  if (target.id === 'allCheck') {
    itemCheckBoxes.forEach((checkbox) => {
      checkbox.checked = target.checked;
    });
  } else {
    const isAllChecked = Array.from(itemCheckBoxes).every(
      (checkbox) => checkbox.checked
    );
    allCheckBox.checked = isAllChecked;
  }
  renderSelectStatus();
  renderTotalPrice();
};

// 주문시 선택한 상품 배열로 가져오기
const getSelectedItems = () => {
  const selectedItems = [];
  const checkedBoxes = document.querySelectorAll(
    '.cart-checkbox:checked:not(#allCheck)'
  );

  checkedBoxes.forEach((checkbox) => {
    const cartItem = checkbox.closest('.cart-item');
    const productId = cartItem.dataset.productId;
    const quantity = cartItem.querySelector('.count-control__status').value;

    selectedItems.push({ productId, quantity });
  });

  return selectedItems;
};

// 주문하기
const onSubmitOrder = (e) => {
  e.preventDefault();
  if (!authService.isAuth) {
    renderToastMessage(ERROR.AUTH_REQUIRED.message, TOAST_TYPES.WARNING);
    return;
  }
  const itemsToOrder = getSelectedItems();
  // localStorage에 저장
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.ORDER_ITEMS,
    JSON.stringify(itemsToOrder)
  );
  // 주문 페이지로 이동
  window.location.href = '/order';
};

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();

  const cartForm = document.getElementById('cartForm');
  cartForm.addEventListener('click', onClickCartForm);
  cartForm.addEventListener('change', onChangeCheckBox);

  await renderCartList();
  renderSelectStatus();
  renderTotalPrice();

  document.addEventListener(CUSTOM_EVENT.CART_UPDATED, async () => {
    await renderCartList();
    renderSelectStatus();
    renderTotalPrice();
  });

  const orderBtn = document.getElementById('orderBtn');
  orderBtn.addEventListener('click', onSubmitOrder);
};

initPage();
