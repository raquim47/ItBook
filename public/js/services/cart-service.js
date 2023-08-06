import authService from './auth-service.js';
import { CUSTOM_EVENT, LOCAL_STORAGE_KEYS } from '../utils/constants.js';
import requestHandler from '../utils/requestHandler.js';
import buildResponse from '../utils/build-response.js';

class CartService {
  constructor() {
    this._cart = [];
  }

  get cart() {
    return this._cart;
  }

  // 장바구니 초기화
  async initializeCart() {
    await this.getCart();
  }

  // 장바구니 가져오기
  async getCart() {
    if (authService.isAuth) {
      const onSuccess = (data) => {
        this._cart = data;
      };
      return requestHandler('/api/cart', 'GET', null, onSuccess);
    } else {
      const localStorageCart = localStorage.getItem(
        LOCAL_STORAGE_KEYS.CART_ITEMS
      );
      this._cart = localStorageCart ? JSON.parse(localStorageCart) : [];
    }
  }

  // 장바구니 상품 추가
  async postToCart(item) {
    if (authService.isAuth) {
      return requestHandler('/api/cart', 'POST', item, this.onSuccess);
    } else {
      const existingItem = this.cart.find(
        (product) => product.productId === item.productId
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.cart.unshift(item);
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CART_ITEMS,
        JSON.stringify(this.cart)
      );
      this.dispatchCartUpdate();
      return buildResponse();
    }
  }

  // 장바구니 상품 삭제
  async deleteFromCart(productId) {
    if (authService.isAuth) {
      return requestHandler(
        `/api/cart/${productId}`,
        'DELETE',
        null,
        this.onSuccess
      );
    } else {
      this._cart = this._cart.filter((item) => item.productId !== productId);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CART_ITEMS,
        JSON.stringify(this._cart)
      );
      this.dispatchCartUpdate();
      return buildResponse();
    }
  }

  // 장바구니 상품 여러개 삭제
  async deleteMultipleFromCart(productIds) {
    if (authService.isAuth) {
      return requestHandler(`/api/cart/`, 'DELETE', productIds, this.onSuccess);
    } else {
      this._cart = this._cart.filter(
        (item) => !productIds.includes(item.productId)
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CART_ITEMS,
        JSON.stringify(this._cart)
      );
      this.dispatchCartUpdate();
      return buildResponse();
    }
  }

  // 장바구니 수량 변경
  async putCartItemQuantity(productId, direction) {
    if (authService.isAuth) {
      return requestHandler(
        `/api/cart/${productId}/${direction}`,
        'PUT',
        null,
        this.onSuccess
      );
    } else {
      const item = this._cart.find((i) => i.productId === productId);
      if (item) {
        if (direction === 'increase') {
          item.quantity++;
        } else if (direction === 'decrease') {
          item.quantity--;
        }
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CART_ITEMS,
          JSON.stringify(this._cart)
        );
      }
      this.dispatchCartUpdate();
      return buildResponse();
    }
  }

  // 로그인 시 로컬 스토래지 -> 서버 장바구니 데이터 합치기
  async postMergeCarts() {
    return requestHandler(
      '/api/cart/merge',
      'POST',
      this._cart,
      this.onSuccess
    );
  }

  onSuccess = (data) => {
    this._cart = data;
    this.dispatchCartUpdate();
  };
  // updateCart 이벤트 발행
  dispatchCartUpdate() {
    const event = new CustomEvent(CUSTOM_EVENT.CART_UPDATED);
    document.dispatchEvent(event);
    console.log('event');
  }
}

const cartService = new CartService();
export default cartService;
