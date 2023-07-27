import express from 'express';
import {
  renderHomePage,
  renderProductListPage,
  renderProductDetailPage,
  renderCartPage
} from '../controllers/public';

const router = express.Router();

router.get('/', renderHomePage);

router.get('/products/:mainCategory', renderProductListPage);

router.get('/product/:productId', renderProductDetailPage);

router.get('/cart', renderCartPage);

export default router;
