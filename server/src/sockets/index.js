// socketHandler.js
import File from '../models/File.js';
import Message from '../models/Message.js';
import Log from '../models/Log.js';

const rooms = {}; // track rooms and users

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('join-room', async ({ roomId, user }) => {
      try {
        if (!rooms[roomId]) rooms[roomId] = { users: {} };
        rooms[roomId].users[socket.id] = user;
        socket.join(roomId);

        // Send previous messages to the newly joined user
        const previousMessages = await Message.find({ room: roomId })
          .populate('sender', 'name email role')
          .sort({ createdAt: 1 })
          .limit(50); // Limit to last 50 messages

        console.log(`User ${user.name} joined room ${roomId}, sending ${previousMessages.length} previous messages`);
        socket.emit('chat-history', { messages: previousMessages });

        io.to(roomId).emit('presence-update', Object.values(rooms[roomId].users));
      } catch (err) {
        console.error('join-room error:', err.message);
      }
    });

    socket.on('code-change', ({ roomId, content, cursor }) => {
      socket.broadcast.to(roomId).emit('code-change', { content, cursor, sender: socket.id });
    });

    socket.on('cursor-change', ({ roomId, cursor }) => {
      socket.broadcast.to(roomId).emit('cursor-change', { cursor, sender: socket.id });
    });

    socket.on('save-file', async ({ fileId, content, authorId }) => {
      try {
        // Skip saving for demo rooms (non-ObjectId fileIds)
        if (!fileId || fileId.startsWith('demo-') || fileId.length !== 24) {
          console.log('Skipping save for demo room:', fileId);
          return;
        }

        const file = await File.findById(fileId);
        if (!file) {
          console.log('File not found:', fileId);
          return;
        }

        file.versions.push({ content, author: authorId });
        file.content = content;
        file.updatedAt = new Date();
        await file.save();

        io.to(file._id.toString()).emit('file-saved', { fileId: file._id });
      } catch (err) {
        console.error('save-file error:', err.message);
      }
    });

    socket.on('chat-message', async ({ roomId, senderId, text }) => {
      try {
        const msg = await Message.create({ room: roomId, sender: senderId, text });
        // Populate sender information before sending to clients
        await msg.populate('sender', 'name email role');
        console.log('Broadcasting message to room:', roomId, 'Message:', msg);
        io.to(roomId).emit('chat-message', { message: msg });
      } catch (err) {
        console.error('chat message error:', err.message);
      }
    });

    socket.on('log', async ({ userId, action, meta }) => {
      try {
        await Log.create({ user: userId, action, meta, ip: socket.handshake.address });
      } catch (err) {
        console.error('log error:', err.message);
      }
    });

    // WebRTC events for video calling
    socket.on('join-call', (roomId) => {
      socket.join(`call-${roomId}`);
      console.log(`User ${socket.id} joined call room: ${roomId}`);
    });

    socket.on('offer', ({ roomId, offer }) => {
      socket.broadcast.to(`call-${roomId}`).emit('offer', offer);
    });

    socket.on('answer', ({ roomId, answer }) => {
      socket.broadcast.to(`call-${roomId}`).emit('answer', answer);
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
      socket.broadcast.to(`call-${roomId}`).emit('ice-candidate', { candidate });
    });

    socket.on('disconnect', () => {
      Object.keys(rooms).forEach((roomId) => {
        if (rooms[roomId]?.users[socket.id]) {
          delete rooms[roomId].users[socket.id];
          io.to(roomId).emit('presence-update', Object.values(rooms[roomId].users));
        }
      });
      console.log('socket disconnected', socket.id);
    });
  });
}
