import express from 'express';
import { Productadd } from '../controller/adminController.js';
import upload from '../middleware/multer.js';


const router = express.Router();

//---------------------Admin-Register Process ---------------------------//------

router.post('/Productadd',upload.single("file"),Productadd);

export default router;
