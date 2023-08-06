import requestHandler from '../utils/requestHandler.js';

class OrderService {
  constructor() {
    this._orders = [];
  }

  get orders() {
    return this._orders;
  }

  async getMyOrder() {
    return requestHandler('/api/order');
  }

  async postOrder(orderData) {
    return requestHandler('/api/order', 'POST', orderData);
  }

  async putCancelOrder(orderId) {
    return requestHandler(`/api/order/cancel/${orderId}`, 'PUT');
  }

  async putOrderStatus(orderId, status) {
    return requestHandler(`/api/order/${orderId}/status`, 'PUT', {
      status,
    });
  }

  async deleteOrder(orderId) {
    return requestHandler(`/api/order/${orderId}`, 'DELETE');
  }

  async getAllOrders() {
    const data = await requestHandler('/api/orders');
    const orders = data ? data.orders : [];
    this._orders = orders;
    return orders;
  }

  // updateCart 이벤트 발행
  dispatchCartUpdate() {
    const event = new CustomEvent(CUSTOM_EVENT.CART_UPDATED);
    document.dispatchEvent(event);
  }
}

const orderService = new OrderService();
export default orderService;
