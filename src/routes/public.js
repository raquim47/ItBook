import express from 'express';
import {
  renderHomePage,
  renderProductListPage,
  renderProductDetailPage,
} from '../controllers/public';

const router = express.Router();

router.get('/', renderHomePage);

router.get('/products/:mainCategory', renderProductListPage);

router.get('/product/:productId', renderProductDetailPage);

export default router;
