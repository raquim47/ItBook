import { Router } from 'express';
import { getAuthStatus, postLogin, postJoin } from '../controllers/auth';

const router = Router();

router.get('/api/auth/check', getAuthStatus);

router.post('/api/auth/login', postLogin);

router.post('/api/auth/join', postJoin);

export default router;
