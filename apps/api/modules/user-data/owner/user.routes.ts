import { Router } from 'express';
import { getUserData, updateUserData, deleteUser } from './user.controller';
import { authenticateToken } from '../../../middlewares/authenticate-token.middleware';

const router = Router();

router.get('/user-data', authenticateToken, getUserData);

router.patch('/user-data', authenticateToken, updateUserData);

router.delete('/user-data', authenticateToken, deleteUser);

export default router;
