import buildResponse from '../utils/build-response.js';
import { ERROR } from '../utils/constants.js';

class OrderService {
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
}

const orderService = new OrderService();
export default orderService;