import authStatus from './authManager.js';

class CartManager {
  constructor() {
    this.cart = [];
    this.initCart();
    document.addEventListener(
      'loginSuccess',
      this.mergeLocalCartWithServer.bind(this)
    );
  }

  async fetchCartFromServer() {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        this.cart = await response.json();
      } else {
        console.error('요청을 처리하는 도중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('요청을 처리하는 도중 문제가 발생했습니다 :', error);
    }
  }

  fetchCartFromLocalStorage() {
    const localStorageCart = localStorage.getItem('cart');
    this.cart = localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  async mergeLocalCartWithServer() {
    if (this.cart.length === 0) return;

    try {
      const response = await fetch('/api/cart/merge', {
        method: 'POST',
        body: JSON.stringify(this.cart),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('cart');
        this.cart = await response.json();
        this.dispatchCartUpdate();
        return
      } 
      const { message } = await response.json();
      console.error(message);
    } catch (error) {
      console.error(error);
    }
  }

  async initCart() {
    await authStatus.checkAuthStatus();
    if (authStatus.isAuth) {
      await this.fetchCartFromServer();
    } else {
      this.fetchCartFromLocalStorage();
    }
    this.dispatchCartUpdate();
  }

  async addItemToCart(item) {
    if (authStatus.isAuth) {
      // 서버에 아이템 추가 로직
      await this.fetchCartFromServer(); // 업데이트된 cart 가져오기
    } else {
      this.cart.push(item); // 로컬에 아이템 추가
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    this.dispatchCartUpdate();
  }

  async removeItemFromCart(itemId) {
    if (authStatus.isAuth) {
      // 서버에서 아이템 제거 로직
      await this.fetchCartFromServer(); // 업데이트된 cart 가져오기
    } else {
      this.cart = this.cart.filter((item) => item.id !== itemId); // 로컬에서 아이템 제거
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    this.dispatchCartUpdate();
  }
  
  // updateCart 이벤트 발행
  dispatchCartUpdate() {
    const event = new CustomEvent('updateCart', { detail: this.cart });
    document.dispatchEvent(event);
  }

  getCart() {
    return this.cart;
  }
}

const cartManager = new CartManager();
export default cartManager;
