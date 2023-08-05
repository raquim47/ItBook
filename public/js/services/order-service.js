import buildResponse from '../utils/build-response.js';
import { ERROR } from '../utils/constants.js';

class OrderService {
  constructor() {
    this._orders = [];
  }

  get orders(){
    return this._orders;
  }

  async getMyOrder() {
    try {
      const response = await fetch('/api/order');

      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In getOrder', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async postOrder(orderData) {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse();
    } catch (error) {
      console.error('In postOrder', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async putCancelOrder(orderId) {
    try {
      const response = await fetch(`/api/order/cancel/${orderId}`, {
        method: 'PUT',
      });

      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In putCancelOrder', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async putOrderStatus(orderId, deliveryStatus) {
    try {
      const response = await fetch(`/api/order/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryStatus }),
      });
      console.log(deliveryStatus)
      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }
      return buildResponse();
    } catch (error) {
      console.error('In putOrderStatus', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async deleteOrder(orderId) {
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }
      return buildResponse();
    } catch (error) {
      console.error('In deleteOrder', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async getAllOrders() {
    try {
      const response = await fetch('/api/orders');

      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }
      this._orders = result.data.orders;
      return buildResponse(result.data);
    } catch (error) {
      console.error('In getAllOrders', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const orderService = new OrderService();
export default orderService;
