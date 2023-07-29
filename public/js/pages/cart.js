import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import cartService from '../services/cartService.js';
import productService from '../services/productService.js';
import { CUSTOM_EVENT } from '../utils/constants.js';

const DELIVERY_FEE = 3000;
const FREE_DELIVERY_THRESHOLD = 30000;

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
          <input class="count-control__status" id="quantity" readonly value="${
            item.quantity
          }" />
          <button type="button" class="count-control__btn"  data-direction="increase">+</button>
        </div>
        <strong class="cart-item__price">${(
          item.price * item.quantity
        ).toLocaleString()} 원</strong>
      </div>
      <div class="cart-item__delete">
        <button type="button" class="x-btn" aria-label="상품 삭제"></button>
      </div>
    </li>`;
};

const renderCartItem = async (item) => {
  const result = await productService.getProductById(item.productId);
  if (result.error) {
    if (result.error === 'NOT_FOUND') {
      console.error(
        `상품 ID ${item.productId}에 해당하는 상품을 찾을 수 없습니다.`
      );
      storage.removeItem(item.productId);
    } else {
      console.error(
        `상품 ID ${item.productId}에 대한 정보를 불러오는데 실패했습니다.`
      );
    }
    return '';
  }

  const cartItem = {
    ...result.data,
    quantity: item.quantity,
  };
  return createCartItemHTML(cartItem);
};

const renderCartList = async () => {
  const cartList = document.getElementById('cartList');

  const cartData = cartService.cart;
  const cartItemsHTMLPromises = cartData.map((item) => renderCartItem(item));
  const cartItemsHTMLArray = await Promise.all(cartItemsHTMLPromises);

  cartList.innerHTML = cartItemsHTMLArray.join('');
};

// 장바구니 품목 수량 변경 / 삭제
const setUpcartItemEvents = () => {
  const cartList = document.getElementById('cartList');
  cartList.addEventListener('click', async (event) => {
    try {
      const target = event.target;
      const productId = target.closest('.cart-item').dataset.productId;
      if (target.classList.contains('count-control__btn')) {
        const direction = target.dataset.direction;
        await cartService.adjustQuantity(productId, direction);
      }
      if (target.classList.contains('x-btn')) {
        await cartService.removeItemFromCart(productId);
      }
    } catch (error) {
      console.error(`Error during handling event: ${error}`);
    }
  });
};

// 체크박스 이벤트 추가
const setUpCheckboxEvents = () => {
  document.getElementById('allCheck').addEventListener('change', (event) => {
    const isAllCheck = event.target.checked;
    const checkboxes = document.querySelectorAll('.cart-checkbox');
    checkboxes.forEach((checkbox) => (checkbox.checked = isAllCheck));
  });
};

const initializeCartPage = () => {
  setupHeader();
  renderScrollTopBtn();
  setUpCheckboxEvents();

  document.addEventListener(CUSTOM_EVENT.CART_UPDATED, renderCartList);
  setUpcartItemEvents();
};

initializeCartPage();
