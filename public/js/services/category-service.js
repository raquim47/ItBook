import buildResponse from '../utils/build-response.js';
import { ERROR } from '../utils/constants.js';

class CategoryService {
  async getCategories() {
    try {
      const response = await fetch('/api/category');
      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse(result.data);
    } catch (error) {
      console.error('In getCategories', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
