import authService from './auth-service.js';
import { CUSTOM_EVENT, ERROR, LOCAL_STORAGE_KEYS } from '../utils/constants.js';
import renderToastMessage from '../components/toast-message.js';
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
    const cartResult = await this.requestGetCart();

    if (cartResult.error) {
      renderToastMessage(cartData.message);
    }
  }

  // 장바구니 가져오기
  async requestGetCart() {
    try {
      if (authService.isAuth) {
        const response = await fetch('/api/cart');
        const result = await response.json();
        if (!response.ok) {
          return buildResponse(null, result.error);
        }

        this._cart = result.data.cart;
      } else {
        const localStorageCart = localStorage.getItem(
          LOCAL_STORAGE_KEYS.CART_ITEMS
        );
        this._cart = localStorageCart ? JSON.parse(localStorageCart) : [];
      }

      this.dispatchCartUpdate();
      return buildResponse();
    } catch (error) {
      console.error('In requestGetCart', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
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

        const result = await response.json();
        if (!response.ok) {
          return buildResponse(null, result.error);
        }

        this._cart = result.data.cart;
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
      }

      this.dispatchCartUpdate();
      return buildResponse();
    } catch (error) {
      console.error('In requestPostToCart', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  // 장바구니 상품 삭제
  async requestDeleteFromCart(productId) {
    try {
      if (authService.isAuth) {
        const response = await fetch(`/api/cart/${productId}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        if (!response.ok) {
          return buildResponse(null, result.error);
        }

        this._cart = result.data.cart;
      } else {
        this._cart = this._cart.filter((item) => item.productId !== productId);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CART_ITEMS,
          JSON.stringify(this._cart)
        );
      }

      this.dispatchCartUpdate();
      return buildResponse();
    } catch (error) {
      console.error('In requestDeleteFromCart', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
  
  // 장바구니 상품 여러개 삭제
  async requestDeleteMultipleFromCart(productIds) {
    try {
      if (authService.isAuth) {
        const response = await fetch(`/api/cart`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIds }),
        });

        const result = await response.json();
        if (!response.ok) {
          return buildResponse(null, result.error);
        }

        this._cart = result.data.cart;
      } else {
        this._cart = this._cart.filter(
          (item) => !productIds.includes(item.productId)
        );
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CART_ITEMS,
          JSON.stringify(this._cart)
        );
      }

      this.dispatchCartUpdate();
      return buildResponse();
    } catch (error) {
      console.error('In requestDeleteMultipleFromCart', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  // 장바구니 수량 변경
  async requestPutCartItemQuantity(productId, direction) {
    try {
      if (authService.isAuth) {
        const response = await fetch(`/api/cart/${productId}/${direction}`, {
          method: 'PUT',
        });

        const result = await response.json();
        if (!response.ok) {
          return buildResponse(null, result.error);
        }

        this._cart = result.data.cart;
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
      return buildResponse();
    } catch (error) {
      console.error('In requestPutCartItemQuantity', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  // 로그인 시 로컬 스토래지 -> 서버 장바구니 데이터 합치기
  async requestPostMergeCarts() {
    try {
      if (this.cart.length === 0) {
        this.dispatchCartUpdate();
        buildResponse();
      }

      const response = await fetch('/api/cart/merge', {
        method: 'POST',
        body: JSON.stringify(this._cart),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      this._cart = result.data.cart;

      localStorage.removeItem(LOCAL_STORAGE_KEYS.CART_ITEMS);
      this.dispatchCartUpdate();
      return buildResponse();
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
