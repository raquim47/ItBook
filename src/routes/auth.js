import { Router } from 'express';
import { postLogin, postJoin } from '../controllers/auth';

const router = Router();

router.post('/api/login', postLogin);

router.post('/api/join', postJoin);

export default router;
