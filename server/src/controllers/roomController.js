import createError from 'http-errors';
import crypto from 'crypto';

// In-memory storage for interview rooms (in production, use Redis or database)
const interviewRooms = new Map();

// Create interview room (interviewer only)
export const createRoom = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    // Generate unique room ID
    const roomId = crypto.randomBytes(6).toString('hex').toUpperCase();
    
    // Create room object
    const room = {
      id: roomId,
      title: title || 'Interview Session',
      description: description || '',
      createdBy: req.user._id,
      createdByName: req.user.name,
      createdAt: new Date(),
      isActive: true,
      participants: [],
      maxParticipants: 2 // 1 interviewer + 1 candidate
    };
    
    // Store room
    interviewRooms.set(roomId, room);
    
    res.status(201).json({
      success: true,
      roomId: roomId,
      room: room,
      message: 'Interview room created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Join room (candidate or interviewer)
export const joinRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    
    // Check if room exists
    const room = interviewRooms.get(roomId);
    if (!room) {
      throw createError(404, 'Room not found');
    }
    
    // Check if room is active
    if (!room.isActive) {
      throw createError(400, 'Room is no longer active');
    }
    
    // Check if user is already in room
    const existingParticipant = room.participants.find(p => p.userId === req.user._id.toString());
    if (existingParticipant) {
      return res.json({
        success: true,
        room: room,
        message: 'Already in room'
      });
    }
    
    // Check room capacity
    if (room.participants.length >= room.maxParticipants) {
      throw createError(400, 'Room is full');
    }
    
    // Add participant
    const participant = {
      userId: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      joinedAt: new Date()
    };
    
    room.participants.push(participant);
    
    res.json({
      success: true,
      room: room,
      message: 'Successfully joined room'
    });
  } catch (err) {
    next(err);
  }
};

// Get room info
export const getRoomInfo = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    
    const room = interviewRooms.get(roomId);
    if (!room) {
      throw createError(404, 'Room not found');
    }
    
    res.json({
      success: true,
      room: room
    });
  } catch (err) {
    next(err);
  }
};

// End room (creator only)
export const endRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    
    const room = interviewRooms.get(roomId);
    if (!room) {
      throw createError(404, 'Room not found');
    }
    
    // Check if user is the creator
    if (room.createdBy.toString() !== req.user._id.toString()) {
      throw createError(403, 'Only room creator can end the room');
    }
    
    // Mark room as inactive
    room.isActive = false;
    room.endedAt = new Date();
    
    res.json({
      success: true,
      message: 'Room ended successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Get active rooms for user
export const getUserRooms = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const userRoles = req.user.role;
    
    const userRooms = [];
    
    for (const [roomId, room] of interviewRooms) {
      // Show rooms created by user (if interviewer) or rooms they've joined
      if (room.createdBy.toString() === userId || 
          room.participants.some(p => p.userId === userId)) {
        userRooms.push(room);
      }
    }
    
    res.json({
      success: true,
      rooms: userRooms.filter(room => room.isActive)
    });
  } catch (err) {
    next(err);
  }
};

// Leave room
export const leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();
    
    const room = interviewRooms.get(roomId);
    if (!room) {
      throw createError(404, 'Room not found');
    }
    
    // Remove participant
    room.participants = room.participants.filter(p => p.userId !== userId);
    
    res.json({
      success: true,
      message: 'Left room successfully'
    });
  } catch (err) {
    next(err);
  }
};

