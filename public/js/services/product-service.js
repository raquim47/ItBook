import requestHandler from '../utils/requestHandler.js';

class ProductService {
  async getProducts() {
    return requestHandler('/api/products');
  }

  async getProduct(productId) {
    return requestHandler(`/api/product/${productId}`);
  }

  async postProduct(productData) {
    return requestHandler('/api/product', 'POST', productData);
  }

  async putProduct(productId, productData) {
    return requestHandler(`/api/product/${productId}`, 'PUT', productData);
  }

  async deleteProduct(productId) {
    return requestHandler(`/api/product/${productId}`, 'DELETE');
  }
}

const productService = new ProductService();
export default productService;
