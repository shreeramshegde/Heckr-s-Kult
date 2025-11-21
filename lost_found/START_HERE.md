# 🚀 Quick Start Guide - NIE Lost & Found App

## ✅ Setup Complete!

All dependencies have been successfully installed. Your app is ready to run!

---

## 📋 Prerequisites

Before starting the app, ensure you have:

1. **MongoDB** - Running on `localhost:27017`
   - Quick start with Docker: `docker-compose up -d`
   - Or install MongoDB locally

2. **Node.js** - Already installed ✓

3. **Expo Go App** (for mobile testing)
   - Download from App Store or Google Play
   - Or use Android/iOS emulator

---

## 🎯 Starting the Application

### Option 1: Using VS Code Debug (Recommended)

1. Open VS Code
2. Press `F5` or go to **Run > Start Debugging**
3. Select **"Full Stack: Start All"**
4. This will start:
   - MongoDB (Docker)
   - Backend server (port 5000)
   - Expo frontend (port 8081)

### Option 2: Manual Terminal Commands

**Terminal 1 - Start MongoDB:**
```powershell
docker-compose up
```

**Terminal 2 - Start Backend:**
```powershell
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 3 - Start Frontend:**
```powershell
npx expo start
```
Frontend Metro bundler will start with QR code

**Terminal 4 - (Optional) Seed Database:**
```powershell
cd backend
npm run seed
```
Creates test users and sample lost/found items

---

## 📱 Testing the App

### On Physical Device:
1. Install **Expo Go** app on your phone
2. Scan the QR code from terminal
3. App will load automatically

### On Emulator:
1. Press `a` for Android emulator
2. Press `i` for iOS simulator

### Test Accounts (after seeding):
```
Email: john.doe@nie.ac.in
Password: password123

Email: jane.smith@nie.ac.in
Password: password123

Email: bob.wilson@nie.ac.in
Password: password123
```

---

## 🔍 API Testing

### Postman Collection
Import: `backend/postman_collection.json`

### API Base URL
```
http://localhost:5000/api
```

### Test Endpoints:
```bash
# Register
POST http://localhost:5000/api/auth/register
Body: { "name": "Test User", "email": "test@nie.ac.in", "password": "test123" }

# Login
POST http://localhost:5000/api/auth/login
Body: { "email": "test@nie.ac.in", "password": "test123" }

# Get Posts
GET http://localhost:5000/api/posts
```

---

## 📂 Project Structure

```
lost_found/
├── backend/              # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── models/      # Mongoose schemas
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, upload, etc.
│   │   └── utils/       # Matching algorithm, seed data
│   └── tests/           # Jest tests
│
├── src/                 # React Native frontend
│   ├── screens/        # App screens (Lost, Found, Post, User)
│   ├── components/     # Reusable components
│   ├── navigation/     # React Navigation setup
│   ├── context/        # Auth & Theme contexts
│   ├── services/       # API calls
│   └── theme/          # Color system
│
└── .vscode/            # Debug configurations
```

---

## 🎨 Features

### Authentication
- ✅ Email validation (only @nie.ac.in)
- ✅ JWT token-based auth
- ✅ Password hashing (bcrypt)
- ✅ Persistent login (AsyncStorage)

### Lost Items
- ✅ Create lost item posts
- ✅ Security question protection
- ✅ Image upload support
- ✅ Category filtering
- ✅ Date/location tracking

### Found Items
- ✅ Create found item posts
- ✅ Automatic matching algorithm
- ✅ Top 3 match suggestions
- ✅ Match scoring (category, color, date, text, location)

### Claiming
- ✅ Security question verification
- ✅ Contact info reveal on success
- ✅ Claim attempt logging

### Theme
- ✅ Dark mode (#0B0F14 background)
- ✅ Neon blue accents (#00E5FF - only neon color)
- ✅ Glowing button effects
- ✅ Theme toggle in settings

---

## 🧪 Running Tests

```powershell
cd backend
npm test
```

Tests include:
- ✅ Auth validation (@nie.ac.in email check)
- ✅ Matching algorithm accuracy
- ✅ API endpoint testing

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB with Docker
docker-compose up -d

# Check if MongoDB is running
docker ps
```

### Port Already in Use
```bash
# Kill process on port 5000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Kill process on port 8081
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess -Force
```

### Expo Not Starting
```bash
# Clear cache and restart
npx expo start --clear
```

### Backend Errors
```bash
# Check environment variables
cd backend
cat .env

# Should contain:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/lost-found
# JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

---

## 📚 Documentation

- **Main README**: `README.md`
- **Setup Guide**: `SETUP_GUIDE.md`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **Backend API**: `backend/README.md`
- **Postman Collection**: `backend/postman_collection.json`

---

## 🎯 Next Steps

1. ✅ Dependencies installed
2. ▶️ Start MongoDB: `docker-compose up -d`
3. ▶️ Seed database: `cd backend && npm run seed`
4. ▶️ Start backend: `cd backend && npm run dev`
5. ▶️ Start frontend: `npx expo start`
6. 📱 Open app in Expo Go

---

## 💡 Tips

- Use **VS Code debug** (F5) to start everything at once
- Test with **Postman** collection for API verification
- Check **browser console** for frontend errors
- Check **backend terminal** for server logs
- Use **Expo Go app** for instant testing on your phone

---

## 📞 Support

- VS Code debugger configurations are in `.vscode/launch.json`
- All npm scripts are in `package.json` files
- Environment variables in `backend/.env`
- Expo configuration in `app.json`

---

**🎉 Everything is ready! Start the app and test the features.**

**Default test login after seeding:**
- Email: `john.doe@nie.ac.in`
- Password: `password123`
