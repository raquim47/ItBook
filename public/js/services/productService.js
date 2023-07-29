class ProductService {
  constructor() {}

  async getProductById(productId) {
    try {
      const response = await fetch(`/api/product/${productId}`);

      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }

      if (!response.ok) {
        throw new Error('REQUEST_ERROR');
      }

      return { data: await response.json() };
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }
}

const productService = new ProductService();

export default productService;