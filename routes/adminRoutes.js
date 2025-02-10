import express from 'express';
import { Productadd, ProductList, ProductListTag } from '../controller/adminController.js';
import upload from '../middleware/multer.js';
import { ValidateProductTag } from '../validation/AdminValidation.js';


const router = express.Router();

//---------------------Admin-Register Process ---------------------------//------
// 
router.post('/Productadd',upload.single("file"),Productadd);

router.get('/prodcutfilter',ProductList);

router.get("/productlistTag",ValidateProductTag, ProductListTag)

export default router;
