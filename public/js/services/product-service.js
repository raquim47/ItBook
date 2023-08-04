import buildResponse from '../utils/build-response.js';
import { ERROR } from '../utils/constants.js';

class ProductService {
  constructor() {}

  async getProducts() {
    try {
      const response = await fetch(`/api/products`);  
      const result = await response.json();
  
      if (!response.ok) {
        return buildResponse(null, result.error);
      }
  
      return buildResponse(result.data);
    } catch (error) {
      console.error('In getProducts', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  
  async postProduct(productData) {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();

      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In postProduct', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async getProduct(productId) {
    try {
      const response = await fetch(`/api/product/${productId}`);
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
  
  async updateProduct(productId, productData) {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();

      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In updateProduct', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const productService = new ProductService();

export default productService;
