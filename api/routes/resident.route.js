import express from 'express';
import { addResident, getResident, getResidents } from '../controllers/resident.controller.js';

const router = express.Router();

router.post('/addResident', addResident);
router.get('/getResident/:residentId', getResident);
router.get('/getResidents', getResidents);


export default router;