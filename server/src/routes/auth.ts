import { Router } from 'express';
import { register, login, getProfile, getUsers } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/users', protect, authorize('admin'), getUsers);

export default router;
