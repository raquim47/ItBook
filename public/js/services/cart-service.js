import authService from './auth-service.js';
import { CUSTOM_EVENT } from '../utils/constants.js';

class CartManager {
  constructor() {
    this._cart = [];
    this.initCart();

    document.addEventListener(
      CUSTOM_EVENT.LOGIN_SUCCESS,
      this.mergeLocalCartWithServer.bind(this)
    );
  }

  get cart() {
    return this._cart;
  }

  // 장바구니 초기화
  async initCart() {
    await authService.fetchAuthStatus();
    if (authService.isAuth()) {
      await this.fetchCartFromServer();
    } else {
      this.fetchCartFromLocalStorage();
    }
    this.dispatchCartUpdate();
  }

  // 장바구니 서버에서 가져오기
  async fetchCartFromServer() {
    try {
      const response = await fetch('/api/cart');

      if (!response.ok) {
        throw new Error('요청을 처리하는 도중 문제가 발생했습니다.');
      }
      this._cart = await response.json();
    } catch (error) {
      console.error('요청을 처리하는 도중 문제가 발생했습니다 :', error);
    }
  }

  // 장바구니 로컬스토래지에서 가져오기
  fetchCartFromLocalStorage() {
    const localStorageCart = localStorage.getItem('cart');
    this._cart = localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  // 로그인 시 로컬 스토래지 -> 서버 장바구니 데이터 합치기
  async mergeLocalCartWithServer() {
    if (this._cart.length === 0) return;

    try {
      const response = await fetch('/api/cart/merge', {
        method: 'POST',
        body: JSON.stringify(this._cart),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      localStorage.removeItem('cart');
      this._cart = await response.json();
      this.dispatchCartUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  // 장바구니에 상품 추가
  async addItemToCart(item) {
    try {
      if (authService.isAuth()) {
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

        this._cart = await response.json();
      } else {
        const cart = this._cart;
        const existingItem = cart.find(
          (product) => product.productId === item.productId
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.unshift(item);
        }

        this._cart = cart;
        localStorage.setItem('cart', JSON.stringify(this._cart));
      }

      this.dispatchCartUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  // 장바구니 상품 삭제
  async removeItemFromCart(productId) {
    try {
      if (authService.isAuth()) {
        const response = await fetch(`/api/cart/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('장바구니에서 상품을 제거하는데 실패했습니다.');
        }

        this._cart = await response.json();
      } else {
        this._cart = this._cart.filter((item) => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(this._cart));
      }

      this.dispatchCartUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  // 장바구니 수량 변경
  async adjustQuantity(productId, direction) {
    try {
      if (authService.isAuth()) {
        const response = await fetch(`/api/cart/${productId}/${direction}`, {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error('요청을 처리하는 도중 문제가 발생했습니다.');
        }

        this._cart = await response.json();
      } else {
        const item = this._cart.find((i) => i.productId === productId);
        if (item) {
          if (direction === 'increase') {
            item.quantity++;
          } else if (direction === 'decrease' && item.quantity > 1) {
            item.quantity--;
          }
          localStorage.setItem('cart', JSON.stringify(this._cart));
        }
      }

      this.dispatchCartUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  // updateCart 이벤트 발행
  dispatchCartUpdate() {
    console.log('cartUpdate')
    const event = new CustomEvent(CUSTOM_EVENT.CART_UPDATED);
    document.dispatchEvent(event);
  }
}

const cartManager = new CartManager();
export default cartManager;
