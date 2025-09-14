import express from 'express';
import auth from '../middleware/auth.js';
import { getMessages } from '../controllers/chatController.js';
const router = express.Router();


router.use(auth);
router.get('/project/:projectId', getMessages);


export default router;