# 🗄️ MongoDB Compass - Local Database Setup Guide

## Overview
This guide will help you connect your NIE Lost & Found app to MongoDB using **MongoDB Compass** (local database).

---

## 📥 Step 1: Install MongoDB & Compass

### Option 1: Download MongoDB Community Edition
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version:** Latest (7.0 or higher)
   - **Platform:** Windows
   - **Package:** MSI
3. Download and run the installer
4. During installation:
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (GUI tool)
   - Accept default settings

### Option 2: Already Have MongoDB?
If you already have MongoDB installed, just download Compass:
- Download: https://www.mongodb.com/try/download/compass
- Install and open it

---

## 🚀 Step 2: Start MongoDB Service

### Windows:
1. **Check if MongoDB is running:**
   ```powershell
   Get-Service MongoDB
   ```

2. **If not running, start it:**
   ```powershell
   Start-Service MongoDB
   ```

3. **Or start manually:**
   - Press `Win + R`
   - Type: `services.msc`
   - Find "MongoDB" in the list
   - Right-click → Start

### Verify MongoDB is Running:
Open Command Prompt or PowerShell:
```powershell
mongod --version
```
Should show version info (e.g., `db version v7.0.x`)

---

## 🔌 Step 3: Connect Using MongoDB Compass

### Open MongoDB Compass

1. Launch **MongoDB Compass** application
2. You'll see a connection screen

### Default Local Connection String:
```
mongodb://localhost:27017
```

### Connection Steps:

1. **In the "New Connection" field, paste:**
   ```
   mongodb://localhost:27017
   ```

2. **Click "Connect"** (or press Enter)

3. **You should see:**
   - Left sidebar showing databases:
     - `admin`
     - `config`
     - `local`
     - And after running your app: `lost_found` (your database)

---

## 🗃️ Step 4: Verify Database Connection

### Method 1: Using MongoDB Compass
1. Connect to `mongodb://localhost:27017`
2. Look for `lost_found` database in the left sidebar
3. If it doesn't exist yet, it will be created automatically when you start your backend server

### Method 2: Using Command Line
```powershell
# Open MongoDB Shell
mongosh

# Show all databases
show dbs

# Use your database
use lost_found

# Show collections (tables)
show collections
```

---

## 🔧 Step 5: Configure Your App

Your backend is **already configured** to use local MongoDB!

### Check Backend Configuration:

**File:** `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost_found
JWT_SECRET=nie_college_lost_found_secret_key_2025_change_in_production
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:8081
COLLEGE_EMAIL_DOMAIN=@nie.ac.in
```

### Explanation:
- **`mongodb://localhost:27017`** - MongoDB server address (local)
- **`/lost_found`** - Database name (will be created automatically)

---

## ✅ Step 6: Test Connection

### Start Your Backend Server:

**Terminal 1:**
```powershell
cd "d:\sdp\final_lost_and _found\lost_found\backend"
npm run dev
```

### Expected Output:
```
✓ Connected to MongoDB
✓ Server running on port 5000
✓ Environment: development
```

If you see "✓ Connected to MongoDB", you're all set! ✅

---

## 📊 Step 7: View Data in MongoDB Compass

Once your backend is running:

### 1. Refresh Compass
- In MongoDB Compass, click the refresh icon in the left sidebar

### 2. You Should See:
```
lost_found/
├── users         (User accounts)
├── posts         (Lost & Found items)
├── matches       (Matching results)
└── notifications (User notifications)
```

### 3. Browse Collections:
- Click on any collection (e.g., `users`)
- See all documents (records)
- Add, edit, or delete data manually

---

## 🌱 Step 8: Seed Sample Data (Optional)

To populate your database with test data:

```powershell
cd "d:\sdp\final_lost_and _found\lost_found\backend"
npm run seed
```

### This Creates:
- **3 test users:**
  - john.doe@nie.ac.in
  - jane.smith@nie.ac.in
  - bob.wilson@nie.ac.in
  - (All passwords: `password123`)

- **5 lost items**
- **4 found items**

### View in Compass:
1. Refresh Compass
2. Browse `lost_found` → `users`
3. See 3 users
4. Browse `posts` → See 9 posts

---

## 🔍 MongoDB Compass Features

### View Documents:
- Click collection → See all records
- Click any document to view details

### Filter Data:
```javascript
// Find lost items only
{ "type": "lost" }

// Find items in specific category
{ "category": "Electronics" }

// Find by owner email
{ "owner.email": "john.doe@nie.ac.in" }
```

### Create New Documents:
1. Select collection
2. Click "Add Data" → "Insert Document"
3. Paste JSON data
4. Click "Insert"

### Edit Documents:
1. Click on a document
2. Click "Edit Document"
3. Modify fields
4. Click "Update"

### Delete Documents:
1. Hover over document
2. Click trash icon
3. Confirm deletion

---

## 🛠️ Troubleshooting

### Issue 1: Can't Connect to MongoDB

**Error:** "Connection refused" or "ECONNREFUSED"

**Solutions:**
1. Check if MongoDB service is running:
   ```powershell
   Get-Service MongoDB
   ```

2. Start MongoDB service:
   ```powershell
   Start-Service MongoDB
   ```

3. Check if port 27017 is in use:
   ```powershell
   Get-NetTCPConnection -LocalPort 27017
   ```

---

### Issue 2: MongoDB Service Won't Start

**Solutions:**

1. **Run as Administrator:**
   - Open PowerShell as Administrator
   - Run: `Start-Service MongoDB`

2. **Start MongoDB Manually:**
   ```powershell
   # Navigate to MongoDB bin folder (adjust path if needed)
   cd "C:\Program Files\MongoDB\Server\7.0\bin"
   
   # Start MongoDB
   .\mongod.exe --dbpath "C:\data\db"
   ```

3. **Create Data Directory:**
   ```powershell
   # Create folder if it doesn't exist
   New-Item -ItemType Directory -Path "C:\data\db" -Force
   ```

---

### Issue 3: Database Not Showing in Compass

**Solutions:**

1. **Refresh Compass:**
   - Click refresh icon in left sidebar

2. **Run Backend Server:**
   - Database is created when app first connects
   - Start backend: `cd backend && npm run dev`

3. **Create Database Manually:**
   - In Compass, click "Create Database"
   - Database name: `lost_found`
   - Collection name: `users`
   - Click "Create Database"

---

### Issue 4: "MongoServerError: Authentication failed"

**Solution:**
Your local MongoDB doesn't have authentication enabled by default.

Connection string should be:
```
mongodb://localhost:27017/lost_found
```

NOT:
```
mongodb://username:password@localhost:27017/lost_found
```

---

## 📋 Connection String Examples

### Local Development (Current Setup):
```
mongodb://localhost:27017/lost_found
```

### With Authentication (If Enabled):
```
mongodb://username:password@localhost:27017/lost_found
```

### Custom Port:
```
mongodb://localhost:27018/lost_found
```

### MongoDB Atlas (Cloud - Future):
```
mongodb+srv://username:password@cluster.mongodb.net/lost_found
```

---

## 🔐 Security Notes

### For Development (Current):
- ✅ No authentication (fine for local development)
- ✅ Only accessible from your computer
- ✅ Database: `lost_found` created automatically

### For Production (Future):
- ⚠️ Enable authentication
- ⚠️ Use strong passwords
- ⚠️ Configure firewall rules
- ⚠️ Use MongoDB Atlas or secure hosting

---

## 📖 Common MongoDB Compass Operations

### Check Database Size:
1. Click database name
2. See "Storage Size" in info panel

### Export Data:
1. Select collection
2. Click "Export Collection"
3. Choose format (JSON/CSV)
4. Save file

### Import Data:
1. Select collection
2. Click "Add Data" → "Import File"
3. Choose JSON/CSV file
4. Click "Import"

### Create Index (Performance):
1. Select collection
2. Click "Indexes" tab
3. Click "Create Index"
4. Choose fields
5. Click "Create"

---

## ✅ Quick Verification Checklist

- [ ] MongoDB installed and running
- [ ] MongoDB Compass installed
- [ ] Connected to `mongodb://localhost:27017`
- [ ] Backend `.env` file configured correctly
- [ ] Backend server starts without errors
- [ ] See "✓ Connected to MongoDB" in terminal
- [ ] `lost_found` database appears in Compass
- [ ] Collections (`users`, `posts`, etc.) created

---

## 🎯 Your Current Setup

```
┌─────────────────────────────────────┐
│   MongoDB Compass (GUI)             │
│   Connection: localhost:27017       │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   MongoDB Server                    │
│   Host: localhost                   │
│   Port: 27017                       │
│   Database: lost_found              │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Your Backend Server               │
│   Port: 5000                        │
│   Connection String:                │
│   mongodb://localhost:27017         │
│           /lost_found               │
└─────────────────────────────────────┘
```

---

## 🚀 You're All Set!

Your MongoDB is now connected and ready to use!

### Next Steps:
1. ✅ Open MongoDB Compass
2. ✅ Connect to `mongodb://localhost:27017`
3. ✅ Start backend server
4. ✅ See `lost_found` database appear
5. ✅ Start using your app!

### Useful Commands:

**Start MongoDB Service:**
```powershell
Start-Service MongoDB
```

**Stop MongoDB Service:**
```powershell
Stop-Service MongoDB
```

**Check MongoDB Status:**
```powershell
Get-Service MongoDB
```

**Start Backend Server:**
```powershell
cd backend
npm run dev
```

**Seed Database:**
```powershell
cd backend
npm run seed
```

---

## 📞 Need Help?

### MongoDB Documentation:
- Compass Guide: https://www.mongodb.com/docs/compass/
- MongoDB Docs: https://www.mongodb.com/docs/

### Common Issues:
- Service not starting → Run as Administrator
- Port 27017 in use → Change port in MongoDB config
- Can't connect → Check firewall settings
- Database not showing → Start backend server first

---

**Happy Database Managing!** 🎉
