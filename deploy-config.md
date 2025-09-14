# Deployment Configuration

## Environment Variables Needed

### Backend (.env):
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret_for_production
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Frontend (.env.production):
```
VITE_API_URL=https://your-backend-url.railway.app
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

## Deployment Steps

### 1. Railway Deployment:
1. Push to GitHub
2. Connect Railway to GitHub repo
3. Deploy backend first
4. Get backend URL
5. Update frontend env vars
6. Deploy frontend

### 2. Alternative: Vercel + Railway:
1. Backend on Railway
2. Frontend on Vercel
3. Update CORS origins in backend
4. Test both deployments

## CORS Configuration for Production:
Update server.js with production URLs:
```javascript
origin: [
  'https://your-frontend.vercel.app',
  'https://your-frontend.railway.app',
  'http://localhost:3000' // for development
]
```


