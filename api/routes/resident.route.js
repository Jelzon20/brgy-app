import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/addResident', addResident);


export default router;