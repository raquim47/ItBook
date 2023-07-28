import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';

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
          <button type="button" class="count-control__btn">-</button>
          <input class="count-control__status" id="quantity" readonly value="${
            item.quantity
          }" />
          <button type="button" class="count-control__btn">+</button>
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

// 로컬 스토래지 관련 메서드
const storage = {
  getCartItems: () => JSON.parse(localStorage.getItem('cart')) ?? [],

  setCartItem: (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  },

  removeItem: (productId) => {
    const cartItems = storage.getCartItems();
    const updatedItems = cartItems.filter(
      (item) => item.productId !== productId
    );
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  },
};

// api 메서드
const requestAPI = {
  fetchProductById: async (productId) => {
    try {
      const response = await fetch(`/api/product/${productId}`);

      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }

      if (!response.ok) {
        throw new Error('REQUEST_ERROR');
      }
      return { data: await response.json() };
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  },
  fetchCart: async () => {
    try {
      const response = await fetch('/api/cart');

      if (!response.ok) {
        throw new Error('REQUEST_ERROR');
      }
      return { data: await response.json() };
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  },
  adjustCartItemQuantity: async (productId, direction) => {
    try {
      const response = await fetch(`/api/cart/${productId}/${direction}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('REQUEST_ERROR');
      }
      return { data: await response.json() };
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  },
  removeCartItem: async (productId) => {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('REQUEST_ERROR');
      }
      return { data: await response.json() };
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  },
};

const renderCartItem = async (item) => {
  const result = await requestAPI.fetchProductById(item.productId);
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

export const renderCartList = async () => {
  const cartList = document.getElementById('cartList');
  const isAuth = cartList.dataset.isAuth === 'true';

  const cartData = isAuth
    ? await requestAPI.fetchCart().data
    : storage.getCartItems();

  const cartItemsHTMLPromises = cartData.map((item) => renderCartItem(item));
  const cartItemsHTMLArray = await Promise.all(cartItemsHTMLPromises);

  cartList.innerHTML = cartItemsHTMLArray.join('');
};

const handleQuantityChange = (target, productId) => {
  const cartItems = storage.getCartItems();
  const item = cartItems.find((i) => i.productId === productId);

  if (!item) return;

  if (target.textContent === '+') {
    item.quantity++;
  } else if (target.textContent === '-' && item.quantity > 1) {
    item.quantity--;
  }

  storage.setCartItem(cartItems);
  renderCartList();
};

const handleItemDeletion = (productId) => {
  storage.removeItem(productId);
  renderCartList();
};

const cartEvents = () => {
  const cartList = document.getElementById('cartList');
  const isAuth = cartList.dataset.isAuth === 'true';

  cartList.addEventListener('click', (event) => {
    if (!isAuth) {
      const target = event.target;
      const productId = target.closest('.cart-item').dataset.productId;

      if (target.classList.contains('count-control__btn')) {
        handleQuantityChange(target, productId);
      }

      if (target.classList.contains('x-btn')) {
        handleItemDeletion(productId);
      }
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
  renderCartList();

  document.addEventListener('loginSuccess', renderCartList);
  cartEvents();
};

initializeCartPage();
