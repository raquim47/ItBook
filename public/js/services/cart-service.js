import authService from './auth-service.js';
import { CUSTOM_EVENT, ERROR, LOCAL_STORAGE_KEYS } from '../utils/constants.js';
import renderToastMessage from '../components/toast-message.js';

class CartService {
  constructor() {
    this._cart = [];
  }

  get cart() {
    return this._cart;
  }

  // 장바구니 초기화
  async initializeCart() {
    const cartData = await this.requestGetCart();

    if (!cartData.success) {
      renderToastMessage(cartData.message, TOAST_TYPES.WANING);
    }
  }

  // 장바구니 가져오기
  async requestGetCart() {
    try {
      if (authService.isAuth) {
        const response = await fetch('/api/cart');
        const data = await response.json();

        if (!response.ok) {
          return data;
        }
        this._cart = data.cart;
      } else {
        const localStorageCart = localStorage.getItem('cart');
        this._cart = localStorageCart ? JSON.parse(localStorageCart) : [];
      }

      this.dispatchCartUpdate();
      return { success: true };
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  // 장바구니에 상품 추가
  async requestPostToCart(item) {
    try {
      if (authService.isAuth) {
        const response = await fetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify(item),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          return data;
        }

        this._cart = data.cart;
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
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CART_ITEMS,
          JSON.stringify(this._cart)
        );
      }

      this.dispatchCartUpdate();
      return { success: true };
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  // 장바구니 상품 삭제
  async requestDeleteFromCart(productId) {
    try {
      if (authService.isAuth) {
        const response = await fetch(`/api/cart/${productId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (!response.ok) {
          return data;
        }

        this._cart = data.cart;
      } else {
        this._cart = this._cart.filter((item) => item.productId !== productId);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CART_ITEMS,
          JSON.stringify(this._cart)
        );
      }

      this.dispatchCartUpdate();
      return { success: true };
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  // 장바구니 수량 변경
  async requestPutCartItemQuantity(productId, direction) {
    try {
      if (authService.isAuth) {
        const response = await fetch(`/api/cart/${productId}/${direction}`, {
          method: 'PUT',
        });
        const data = await response.json();

        if (!response.ok) {
          return data;
        }

        this._cart = data.cart;
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
      }

      this.dispatchCartUpdate();
      return { success: true };
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  // 로그인 시 로컬 스토래지 -> 서버 장바구니 데이터 합치기
  async requestPostMergeCarts() {
    if (this._cart.length === 0) return;

    try {
      const response = await fetch('/api/cart/merge', {
        method: 'POST',
        body: JSON.stringify(this._cart),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return data;
      }

      localStorage.removeItem('cart');
      this._cart = data.cart;
      this.dispatchCartUpdate();

      return { success: true };
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  // updateCart 이벤트 발행
  dispatchCartUpdate() {
    const event = new CustomEvent(CUSTOM_EVENT.CART_UPDATED);
    document.dispatchEvent(event);
  }
}

const cartService = new CartService();
export default cartService;
