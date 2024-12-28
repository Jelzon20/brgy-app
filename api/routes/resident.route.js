import express from 'express';
import { addResident, deleteResident, getResident, getResidents, updateResident } from '../controllers/resident.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/addResident', verifyToken, addResident);
router.get('/getResident/:residentId', getResident);
router.get('/getResidents', getResidents);
router.put('/updateResident/:resident_id', updateResident);
router.delete('/deleteResident/:resident_id', deleteResident);


export default router;