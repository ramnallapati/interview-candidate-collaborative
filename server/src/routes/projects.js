import express from 'express';
import auth from '../middleware/auth.js';
import { createProject, getProjectsForUser } from '../controllers/projectController.js';
const router = express.Router();


router.use(auth);
router.post('/', createProject);
router.get('/', getProjectsForUser);


export default router;