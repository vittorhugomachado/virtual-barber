import { Router } from 'express';
// import { authLimiter } from './middlewares/auth-limiter.middleware';
// import { authenticateToken } from '../../../middlewares/authenticate-token.middleware';
import { signUp } from './auth.controller';

const router = Router();

router.post('/signup', signUp);

// router.post('/login', authLimiter, login);

// router.post('/refresh-token', refreshAccessToken);

// router.post('/logout', authenticateToken, logout);

export default router;
