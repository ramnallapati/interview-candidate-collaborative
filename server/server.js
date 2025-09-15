import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import projectRoutes from './src/routes/projects.js';
import fileRoutes from './src/routes/files.js';
import execRoutes from './src/routes/exec.js';
import chatRoutes from './src/routes/chat.js';
import roomRoutes from './src/routes/rooms.js';
import socketHandler from './src/sockets/index.js';
import {errorHandler} from './src/middleware/errorHandler.js';


dotenv.config();


const app = express();
const server = http.createServer(app);


const io = new IOServer(server, {
cors: {
origin: process.env.NODE_ENV === 'production' 
  ? ['https://interview-collaboration.vercel.app/']
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
methods: ['GET', 'POST'],
credentials: true
}
});


// middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['hhttps://interview-collaboration.vercel.app/']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '2mb' }));


// routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/exec', execRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rooms', roomRoutes);


// error handler
app.use(errorHandler);


// init DB
connectDB();


// init sockets
socketHandler(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});