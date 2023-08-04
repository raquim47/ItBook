// indexRoutes.js
import express from 'express';
import publicApiRoutes from './publicApiRoutes';
import userApiRoutes from './userApiRoutes';
import adminApiRoutes from './adminApiRoutes';
import publicViewRoutes from './publicViewRoutes';
import userViewRoutes from './userViewRoutes';
import adminViewRoutes from './adminViewRoutes';
import { ERROR_PAGE } from '../../public/js/utils/constants';

const router = express.Router();

router.use(publicApiRoutes);
router.use(userApiRoutes);
router.use(adminApiRoutes);
router.use(publicViewRoutes);
router.use(userViewRoutes);
router.use(adminViewRoutes);

// 404
router.use((req, res) => {
  res.status(404).render('error', ERROR_PAGE[404]);
});

export default router;
