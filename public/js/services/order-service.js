import showToast from '../components/toast-message.js';
import { SUCCESS, TOAST_TYPES } from '../utils/constants.js';
import requestHandler from '../utils/requestHandler.js';

class OrderService {
  constructor() {
    this._orders = [];
  }

  get orders() {
    return this._orders;
  }

  // 내 주문 가져오기
  async getMyOrder() {
    return requestHandler('/api/order');
  }

  // 주문 등록
  async postOrder(orderData) {
    return requestHandler('/api/order', 'POST', orderData);
  }

  // 주문 취소
  async putCancelOrder(orderId) {
    return requestHandler(`/api/order/cancel/${orderId}`, 'PUT');
  }

  // 주문 상태 수정
  async putOrderStatus(orderId, status) {
    const onSuccess = async () => {
      const result = await this.getAllOrders();
      if (result.error) return;
      showToast(SUCCESS.ORDER_STATUS_UPDATED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler(
      `/api/order/${orderId}/status`,
      'PUT',
      status,
      onSuccess
    );
  }

  // 주문 삭제
  async deleteOrder(orderId) {
    const onSuccess = async () => {
      const result = await this.getAllOrders();
      if (result.error) return;
      showToast(SUCCESS.ORDER_DELETED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler(`/api/order/${orderId}`, 'DELETE', null, onSuccess);
  }

  // 주문 전체 가져오기
  async getAllOrders() {
    const onSuccess = (data) => {
      this._orders = data;
    };
    return requestHandler('/api/orders', 'GET', null, onSuccess);
  }
}

const orderService = new OrderService();
export default orderService;
