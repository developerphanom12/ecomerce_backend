import express from 'express';
import { Productadd, ProductList } from '../controller/adminController.js';
import upload from '../middleware/multer.js';


const router = express.Router();

//---------------------Admin-Register Process ---------------------------//------
// 
router.post('/Productadd',upload.single("file"),Productadd);

router.get('/prodcutfilter',ProductList);

export default router;
