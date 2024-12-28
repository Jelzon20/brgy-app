import express from 'express';
import { signin, signup, signout, checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/checkAuth', checkAuth);
router.post('/signout', signout);


export default router;