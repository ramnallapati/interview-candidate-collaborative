import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  createRoom,
  joinRoom,
  getRoomInfo,
  endRoom,
  getUserRooms,
  leaveRoom
} from '../controllers/roomController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create room (interviewer only)
router.post('/create', requireRole(['interviewer']), createRoom);

// Join room (any authenticated user)
router.post('/:roomId/join', joinRoom);

// Get room info (any authenticated user)
router.get('/:roomId', getRoomInfo);

// Get user's rooms (any authenticated user)
router.get('/', getUserRooms);

// Leave room (any authenticated user)
router.post('/:roomId/leave', leaveRoom);

// End room (creator only)
router.post('/:roomId/end', endRoom);

export default router;

