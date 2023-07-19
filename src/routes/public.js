import express from 'express';
import { renderHomePage, renderProductsPage } from '../controllers/public';

const router = express.Router();

router.get('/', renderHomePage);
router.get('/products/:mainCategory', renderProductsPage);

export default router;