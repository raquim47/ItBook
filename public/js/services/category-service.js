import requestHandler from '../utils/requestHandler.js';

class CategoryService {
  async getCategories() {
    return requestHandler('/api/category');
  }
}

const categoryService = new CategoryService();
export default categoryService;
