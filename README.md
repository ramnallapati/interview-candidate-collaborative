# 🎯 Real-Time Interview Platform

A comprehensive full-stack interview platform with real-time code collaboration, video calling, and role-based access control.

## 🚀 Live Demo
- **Frontend**: [Deploy URL will be here]
- **Backend API**: [API URL will be here]

## ✨ Features

### 🎓 For Candidates
- Join interview rooms using Room ID
- Real-time code collaboration with Monaco Editor
- Video/Audio calling with interviewers
- Live chat functionality
- Auto-save code changes

### 👔 For Interviewers
- Create demo rooms for testing
- Conduct 1-on-1 or panel interviews
- Real-time code review and guidance
- Video calling with multiple participants
- Monitor candidate progress

### 👑 For Admins
- Complete user management system
- Create and assign interview projects
- System statistics and monitoring
- User role management (Admin/Interviewer/Candidate)
- Activity logs and analytics

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor (VS Code engine)
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Real-time Features
- **Socket.IO** - WebSocket communication
- **WebRTC** - Peer-to-peer video calling
- **Real-time collaboration** - Live code editing
- **Presence detection** - User online status

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Frontend    │    │     Backend     │    │    Database     │
│   (React App)   │◄──►│  (Express API)  │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Monaco Editor │    │ • REST APIs     │    │ • Users         │
│ • Socket.IO     │    │ • Socket.IO     │    │ • Projects      │
│ • WebRTC        │    │ • JWT Auth      │    │ • Messages      │
│ • Video/Chat    │    │ • CORS Config   │    │ • Files         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/interview-platform.git
cd interview-platform
```

2. **Backend Setup**
```bash
cd server
npm install
```

3. **Create backend environment file**
```bash
# Create server/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. **Frontend Setup**
```bash
cd ../client
npm install
```

5. **Start Development Servers**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 User Roles

### 🎓 Candidate
- Register and join interview sessions
- Collaborate on coding challenges
- Participate in video calls
- Use chat for communication

### 👔 Interviewer
- Create demo rooms for testing
- Conduct interviews and evaluate candidates
- Guide coding sessions
- Access to all candidate features

### 👑 Admin
- Complete system administration
- User management (create, update, delete)
- Project management and assignment
- System monitoring and analytics
- Role-based access control

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### CORS Configuration
The application is configured to work with multiple frontend ports:
- localhost:3000
- localhost:3001
- localhost:3002

## 📱 Usage Examples

### Creating an Interview Session
1. **Admin creates project** and assigns interviewer
2. **Interviewer joins room** using project ID
3. **Candidate receives room ID** and joins
4. **Real-time collaboration** begins automatically

### Demo Room for Testing
1. **Interviewer creates demo room** from dashboard
2. **System generates unique room ID** (e.g., demo-1234567890)
3. **Room ID is copied to clipboard** automatically
4. **Share room ID** with candidates via email/chat

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs encryption
- **Role-based Access** - Granular permissions
- **CORS Protection** - Cross-origin security
- **Input Validation** - Request sanitization
- **Error Handling** - Comprehensive error management

## 🚀 Deployment

### Railway (Recommended)
1. Push to GitHub
2. Connect Railway to repository
3. Deploy backend and frontend separately
4. Configure environment variables
5. Update CORS origins for production

### Alternative: Vercel + Railway
- **Frontend**: Deploy on Vercel
- **Backend**: Deploy on Railway
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Project Management
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - System statistics

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Check origin configuration
2. **Socket Connection**: Verify port settings
3. **Database Connection**: Check MongoDB URI
4. **Video Not Working**: Allow camera permissions

### Development Tips
- Use browser dev tools for debugging
- Check both frontend and backend console logs
- Ensure MongoDB Atlas IP whitelist is configured
- Test with multiple browser windows for real-time features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Monaco Editor for the amazing code editor
- Socket.IO for real-time communication
- WebRTC for video calling capabilities
- MongoDB Atlas for database hosting
- Railway/Vercel for deployment platforms



