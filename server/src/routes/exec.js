import express from 'express';
import auth from '../middleware/auth.js';
import { executeCode } from '../controllers/execController.js';
const router = express.Router();


router.use(auth);
router.post('/', executeCode);


export default router;