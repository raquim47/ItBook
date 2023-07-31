import buildResponse from "../utils/build-response.js";
import { ERROR } from "../utils/constants.js";

class ProductService {
  constructor() {}

  async requestGetProduct(productId) {
    try {
      const response = await fetch(`/api/product/${productId}`);
      const result = await response.json();

      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In requestGetProduct', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const productService = new ProductService();

export default productService;
