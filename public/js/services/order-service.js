import buildResponse from '../utils/build-response.js';
import { ERROR } from '../utils/constants.js';

class OrderService {
  async requestGetMyOrder() {
    try {
      const response = await fetch('/api/order');

      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In requestGetOrder', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async requestPostOrder(orderData) {
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
      console.error('In requestPostOrder', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async requestPutCancelOrder(orderId) {
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
      console.error('In requestPutCancleOrder', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const orderService = new OrderService();
export default orderService;
