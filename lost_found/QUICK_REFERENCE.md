# 🎯 Quick Reference Card - Lost & Found App

## 🚀 Start Commands

### Full Stack (VS Code)
```powershell
Press F5 → Select "Full Stack: Start All"
```

### Manual Start
```powershell
# Terminal 1: MongoDB
docker-compose up -d

# Terminal 2: Backend
cd backend; npm run dev

# Terminal 3: Frontend
npm start
```

## 🔑 Test Accounts
```
john.doe@nie.ac.in / password123
jane.smith@nie.ac.in / password123
admin@nie.ac.in / admin123 (Admin)
```

## 📡 API Base URL
```
http://localhost:5000/api
```

## 🎨 Theme Colors
```javascript
Dark BG: #0B0F14
Neon Blue: #00E5FF (PRIMARY accent)
Secondary: #0096C7
Text: #E6F2FF
```

## 📂 Key Files

### Backend
```
backend/src/index.js          - Server entry
backend/src/models/           - Database schemas
backend/src/controllers/      - Business logic
backend/src/routes/           - API routes
backend/src/utils/matching.js - Matching algorithm
backend/src/utils/seed.js     - Seed script
backend/.env                  - Environment config
```

### Frontend
```
App.js                        - Root component
src/navigation/AppNavigator.js - Navigation setup
src/screens/                  - All screens
src/components/               - Reusable components
src/context/AuthContext.js    - Authentication
src/context/ThemeContext.js   - Theme management
src/services/api.js           - Axios client
```

## 📋 Common Tasks

### Reset Database
```powershell
cd backend
npm run seed
```

### Run Tests
```powershell
cd backend
npm test
```

### Clear Expo Cache
```powershell
npx expo start --clear
```

### View Logs
```powershell
# Backend: Check terminal
# Frontend: Press 'j' in Expo menu
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in backend/.env |
| MongoDB won't start | `docker-compose restart` |
| Expo crash | `npx expo start --clear` |
| Can't login | Check email ends with @nie.ac.in |
| Images not loading | Check backend/uploads/ exists |

## 📱 App Navigation

```
Auth Flow:
  Login → Register

Main Tabs (After Login):
  Lost     → List lost items → Detail → Claim
  Found    → List found items → Detail
  Post     → Create lost/found post
  User     → Profile → My Posts → Settings
```

## 🔐 Security Features

- ✅ @nie.ac.in email validation
- ✅ bcrypt password hashing
- ✅ JWT authentication (7-day)
- ✅ Rate limiting (auth, claim)
- ✅ Security question verification
- ✅ Claim attempt logging

## 📊 Matching Algorithm

```
Score = Category(30%) + Color(20%) + Date(20%) + 
        Text(20%) + Location(10%)

Threshold: 50% minimum
Top 3 matches stored
```

## 🎯 Quick Test Flow

1. **Start App** → F5 in VS Code
2. **Login** → john.doe@nie.ac.in / password123
3. **Create Lost** → Post tab → LOST → Fill form
4. **Create Found** → Post tab → FOUND → Similar item
5. **Check Matches** → Lost tab → See matched items
6. **Claim Item** → Click lost item → Claim → Answer
7. **Get Contact** → Correct answer → See owner info

## 📦 File Sizes

```
Backend: ~50 files, ~3000 LOC
Frontend: ~20 files, ~2000 LOC
Total: ~70 files, ~5000 LOC
```

## 🎨 UI Components

```javascript
<GlowButton />      - Neon blue glowing button
<PostCard />        - Item card with image
<Input />           - Themed text input
```

## 🌐 Expo Commands

```
npm start           - Start dev server
Press a             - Open Android
Press i             - Open iOS  
Press w             - Open web
Press r             - Reload app
Press m             - Toggle menu
Press j             - Open debugger
```

## 📄 Documentation

```
README.md           - Project overview
SETUP_GUIDE.md      - Installation steps
PROJECT_SUMMARY.md  - Complete feature list
backend/README.md   - API documentation
```

## 🎉 Demo Checklist

- [ ] Start MongoDB + Backend + Frontend
- [ ] Login with test account
- [ ] Browse lost items
- [ ] Browse found items
- [ ] Create new lost post with image
- [ ] Create new found post
- [ ] View automatic matches
- [ ] Test claim flow
- [ ] Toggle dark/light theme
- [ ] View user profile
- [ ] Test Postman collection

## 🚨 Important Notes

1. **Email Restriction**: ONLY @nie.ac.in emails allowed
2. **Neon Color**: ONLY #00E5FF neon blue used
3. **Security Answer**: Stored as bcrypt hash
4. **Image Size**: Max 5MB
5. **Token Expiry**: 7 days
6. **Match Threshold**: 50% minimum

## 📞 Need Help?

1. Check SETUP_GUIDE.md
2. Check terminal for errors
3. Clear cache and restart
4. Check MongoDB is running
5. Verify .env file exists

---

**Built for NIE College** | **React Native + Node.js** | **MongoDB**
