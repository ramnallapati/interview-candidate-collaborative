import express from 'express';
import auth from '../middleware/auth.js';
import { createFile, getFilesByProject, updateFileContent } from '../controllers/fileController.js';
const router = express.Router();


router.use(auth);
router.post('/', createFile);
router.get('/project/:projectId', getFilesByProject);
router.put('/:fileId', updateFileContent);


export default router;