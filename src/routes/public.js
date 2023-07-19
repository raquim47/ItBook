import express from 'express';
import { renderHomePage } from '../controllers/public';

const router = express.Router();

router.get('/', renderHomePage);

export default router;