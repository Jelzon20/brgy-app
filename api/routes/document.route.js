import express from 'express';
import { addDocument } from '../controllers/document.controller.js';

const router = express.Router();

// router.post('/addResident', addResident);
// router.get('/getResident/:residentId', getResident);
// router.get('/getResidents', getResidents);
// router.put('/updateResident/:resident_id', updateResident);
// router.delete('/deleteResident/:resident_id', deleteResident);

router.post('/addDocument', addDocument);


export default router;