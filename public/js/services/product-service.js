import buildResponse from '../utils/build-response.js';
import { ERROR } from '../utils/constants.js';

class ProductService {
  constructor() {}

  async getProduct(productId, fields = null) {
    try {
      const endpoint = fields ? `/api/product/${productId}/?fields=${fields}` : `/api/product/${productId}`;
      const response = await fetch(endpoint);
      const result = await response.json();

      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In getProduct', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const productService = new ProductService();

export default productService;
