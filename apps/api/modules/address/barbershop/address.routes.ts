import { Router } from 'express';
import { getAddress, updateAddress, deleteAddress } from './address.controller';
import { authenticateToken } from '../../../middlewares/authenticate-token.middleware';

const router = Router();

router.get('/address', authenticateToken, getAddress);

router.patch('/address', authenticateToken, updateAddress);

router.delete('/address', authenticateToken, deleteAddress);

export default router;