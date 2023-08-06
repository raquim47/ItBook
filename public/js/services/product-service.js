import showToast from '../components/toast-message.js';
import { SUCCESS, TOAST_TYPES } from '../utils/constants.js';
import requestHandler from '../utils/requestHandler.js';

class ProductService {
  // 상품 전체 가져오기
  async getProducts() {
    return requestHandler('/api/products');
  }

  // 상품(상세) 가져오기
  async getProduct(productId) {
    return requestHandler(`/api/product/${productId}`);
  }

  // 상품 등록
  async postProduct(productData) {
    const onSuccess = () => {
      showToast(SUCCESS.PRODUCT_POSTED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler('/api/product', 'POST', productData, onSuccess);
  }

  // 상품 수정
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

  // 상품 삭제
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
