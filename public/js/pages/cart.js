import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';

const createCartItemHTML = (item) => {
  return `
    <li class="cart-item">
      <div class="cart-item__checkbox">
        <input type="checkbox" class="cart-checkbox" />
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
          <input class="count-control__status" id="quantity" value="${item.quantity}" />
          <button type="button" class="count-control__btn">+</button>
        </div>
        <strong class="item-price">${item.price} 원</strong>
      </div>
      <div class="cart-item__delete">
        <button type="button" class="x-btn" aria-label="상품 삭제"></button>
      </div>
    </li>`;
};

// 로컬 스토래지 관련 메서드
const storage = {
  getCartItems: () => JSON.parse(localStorage.getItem('cart')) ?? [],
  removeItem: (productId) => {
    const cartItems = storage.getCartItems();
    const updatedItems = cartItems.filter(
      (item) => item.productId !== productId
    );
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  },
};

const productService = {
  fetchById: async (productId) => {
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
};

const renderCartList = async () => {
  const cartList = document.getElementById('cartList');
  const isAuth = cartList.dataset['is-auth'] === 'true';
  const cartData = isAuth ? [] : storage.getCartItems();

  let cartItemsHTML = '';
  for (const item of cartData) {
    const result = await productService.fetchById(item.productId);
    if (result.error) {
      if (result.error === 'NOT_FOUND') {
        console.error(`상품 ID ${item.productId}에 해당하는 상품을 찾을 수 없습니다.`);
        storage.removeItem(item.productId);
      } else {
        console.error(`상품 ID ${item.productId}에 대한 정보를 불러오는데 실패했습니다.`);
      }
      continue;
    }
    const cartItem = {
      ...result.data,
      quantity: item.quantity,
    };
    cartItemsHTML += createCartItemHTML(cartItem);
  }
  cartList.innerHTML = cartItemsHTML;
};

const initializeCartPage = () => {
  setupHeader();
  renderScrollTopBtn();
  renderCartList();
};

initializeCartPage();
