import express from 'express';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '../controllers/document.controller.js';

const router = express.Router();

// router.post('/addResident', addResident);
// router.get('/getResident/:residentId', getResident);
// router.get('/getResidents', getResidents);
// router.put('/updateResident/:resident_id', updateResident);
// router.delete('/deleteResident/:resident_id', deleteResident);

router.post('/addDocument', addDocument);
router.get('/getDocuments', getDocuments);
router.put('/updateDocument/:id', updateDocument);
router.delete('/deleteDocument/:id', deleteDocument);


export default router;