import { ERROR } from "../utils/constants.js";

class ProductService {
  constructor() {}

  async requestGetProduct(productId) {
    try {
      const response = await fetch(`/api/product/${productId}`);
      const data = await response.json();

      if (!response.ok) {
        return data;
      }

      return { success: true, product: data.product };
    } catch (err) {
      console.error(err);
      return ERROR.REQUEST_FAILED;
    }
  }
}

const productService = new ProductService();

export default productService;
