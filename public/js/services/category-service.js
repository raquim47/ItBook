import showToast from '../components/toast-message.js';
import { SUCCESS, TOAST_TYPES } from '../utils/constants.js';
import requestHandler from '../utils/requestHandler.js';

class CategoryService {
  // 카테고리 전체 가져오기
  async getCategories() {
    return requestHandler('/api/categories');
  }

  // 카테고리 한 개 가져오기
  async getCategory(categoryId) {
    return requestHandler(`/api/category/${categoryId}`);
  }

  // 카테고리 등록
  async postCategory(categoryData) {
    const onSuccess = () => {
      showToast(SUCCESS.CATEGORY_POSTED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler('/api/category', 'POST', categoryData, onSuccess);
  }

  // 카테고리 수정
  async putCategory(categoryId, categoryData) {
    const onSuccess = () => {
      showToast(SUCCESS.CATEGORY_UPDATED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler(
      `/api/category/${categoryId}`,
      'PUT',
      categoryData,
      onSuccess
    );
  }

  // 카테고리 삭제
  async deleteCategory(categoryId) {
    const onSuccess = () => {
      showToast(SUCCESS.CATEGORY_DELETED, TOAST_TYPES.SUCCESS);
    };
    return requestHandler(
      `/api/category/${categoryId}`,
      'DELETE',
      null,
      onSuccess
    );
  }
}

const categoryService = new CategoryService();
export default categoryService;
