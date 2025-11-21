# 🚀 Quick Setup Guide - Lost & Found App

## Step-by-Step Installation (Windows)

### 1. Prerequisites Check

Open PowerShell and verify installations:

```powershell
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
```

If not installed, download from: https://nodejs.org/

### 2. Install MongoDB

**Option A: Using Docker (Recommended)**
```powershell
# Install Docker Desktop from https://www.docker.com/products/docker-desktop/
# Then run:
docker-compose up -d
```

**Option B: Local Installation**
- Download MongoDB Community Server: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

### 3. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file is already created with default settings
# Edit if needed: backend/.env

# Seed database with test data
npm run seed

# Start backend server
npm run dev
```

You should see:
```
✓ Connected to MongoDB
✓ Server running on port 5000
```

### 4. Frontend Setup

Open a NEW PowerShell terminal:

```powershell
# From lost_found root directory
npm install

# Start Expo development server
npm start
```

### 5. Run on Device/Emulator

When Expo starts, you'll see options:

**For Android:**
- Press `a` to open in Android emulator
- OR scan QR code with Expo Go app

**For iOS (Mac only):**
- Press `i` to open in iOS simulator

**For Web:**
- Press `w` to open in browser

### 6. Test Login

Use seeded test accounts:
- Email: `john.doe@nie.ac.in`
- Password: `password123`

## 🎯 VS Code Setup (Recommended)

1. **Open Project in VS Code**
   ```powershell
   code .
   ```

2. **Install Recommended Extensions**
   - VS Code will prompt to install recommended extensions
   - Click "Install All"

3. **Start Full Stack (F5)**
   - Press `F5` in VS Code
   - Select "Full Stack: Start All"
   - Both backend and frontend will start automatically

## 🧪 Testing the App

### Test Authentication
1. Open app → Register with `yourname@nie.ac.in`
2. Use password with 6+ characters
3. Login with credentials

### Test Lost Item Flow
1. Go to "Post" tab
2. Select "LOST"
3. Fill in details + security question
4. Submit

### Test Found Item Flow
1. Go to "Post" tab
2. Select "FOUND"
3. Fill in details (similar to a lost item)
4. Submit → Check for automatic matches

### Test Claim Flow
1. Browse "Lost" tab
2. Click on a lost item
3. Click "Claim This Item"
4. Answer security question correctly
5. See owner contact details

## 📱 Using Postman

1. Import collection:
   - Open Postman
   - Import → `backend/postman_collection.json`

2. Set base URL:
   - Collection variables → `baseUrl` = `http://localhost:5000/api`

3. Login to get token:
   - Run "Auth → Login"
   - Token automatically saved

4. Test endpoints:
   - All requests now include auth token

## 🐛 Common Issues & Fixes

### "Cannot connect to MongoDB"
```powershell
# Check if MongoDB is running
docker ps                    # For Docker
# OR
net start MongoDB            # For local install

# Restart MongoDB
docker-compose restart       # For Docker
# OR
net stop MongoDB             # For local install
net start MongoDB
```

### "Port 5000 already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# OR change port in backend/.env
# PORT=5001
```

### "Expo won't start"
```powershell
# Clear cache and reinstall
npx expo start --clear
npm install
```

### "Images not uploading"
- Ensure `backend/uploads/` directory exists
- Check file size < 5MB
- Try JPEG/PNG format

### "Email validation failing"
- Email MUST end with `@nie.ac.in`
- Example: `student.name@nie.ac.in`

## 📊 Database Management

### View Database (MongoDB Compass)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `lost_found`
4. View collections: `users`, `posts`, `matches`

### Reset Database
```powershell
cd backend
npm run seed     # Clears and reseeds data
```

### Backup Database
```powershell
# Export
mongodump --db lost_found --out ./backup

# Import
mongorestore --db lost_found ./backup/lost_found
```

## 🔧 Development Tips

### Hot Reload
- Frontend: Auto-reloads on file save (Expo)
- Backend: Auto-restarts with nodemon

### Debug Backend (VS Code)
1. Set breakpoint in code
2. Press `F5`
3. Select "Backend: Start"
4. Make API request

### View Logs
```powershell
# Backend logs in terminal
# OR check VS Code Debug Console

# Expo logs
npx expo start
# Then press 'j' to open debugger
```

### Format Code
- VS Code auto-formats on save
- Manual format: `Shift+Alt+F`

## 🎨 Customize Theme

Edit `src/theme/theme.js`:

```javascript
export const colors = {
  darkBg: '#0B0F14',           // Dark background
  neonBlue: '#00E5FF',         // Primary accent (ONLY neon color)
  neonBlueSecondary: '#0096C7', // Secondary state
  // ... other colors
};
```

## 📱 Build for Production

### Android APK
```powershell
# Install EAS CLI
npm install -g eas-cli

# Build APK
eas build --platform android --profile preview
```

### Backend Deployment
```powershell
# Set environment
$env:NODE_ENV="production"

# Install PM2
npm install -g pm2

# Start with PM2
cd backend
pm2 start src/index.js --name lost-found-api
pm2 save
pm2 startup
```

## 📞 Getting Help

1. **Check Logs**: Look for error messages in terminal
2. **Restart Everything**: Close all terminals, restart MongoDB, restart servers
3. **Clear Cache**: 
   ```powershell
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

## ✅ Verification Checklist

- [ ] MongoDB running (port 27017)
- [ ] Backend running (port 5000)
- [ ] Frontend running (Expo started)
- [ ] Can login with test account
- [ ] Can create lost/found posts
- [ ] Can view posts in lists
- [ ] Images upload successfully
- [ ] Claim flow works
- [ ] Notifications appear

## 🎉 You're All Set!

The app should now be fully functional. Test all features:
1. Register → Login
2. Post Lost Item → Post Found Item
3. Check for automatic matches
4. Test claim flow with security question
5. Browse your posts in User tab

Happy coding! 🚀
