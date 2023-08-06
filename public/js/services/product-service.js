import showToast from '../components/toast-message.js';
import { SUCCESS, TOAST_TYPES } from '../utils/constants.js';
import requestHandler from '../utils/requestHandler.js';

class ProductService {
  async getProducts() {
    return requestHandler('/api/products');
  }

  async getProduct(productId) {
    return requestHandler(`/api/product/${productId}`);
  }

  async postProduct(productData) {
    const onSuccess = () => {
      showToast(SUCCESS.PRODUCT_POSTED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler('/api/product', 'POST', productData, onSuccess);
  }

  async putProduct(productId, productData) {
    const onSuccess = () => {
      showToast(SUCCESS.PRODUCT_UPDATED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler(
      `/api/product/${productId}`,
      'PUT',
      productData,
      onSuccess
    );
  }

  async deleteProduct(productId) {
    const onSuccess = () => {
      showToast(SUCCESS.PRODUCT_DELETED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler(
      `/api/product/${productId}`,
      'DELETE',
      null,
      onSuccess
    );
  }
}

const productService = new ProductService();
export default productService;
