# 🔄 Updated Claim Flow - NIE Lost & Found App

## 📋 Summary of Changes

Your app now implements a **60% similarity threshold** with automatic security question verification when someone posts a found item.

---

## 🎯 New Flow Explanation

### Scenario:
1. **User A** loses an item and posts it as "LOST" with a security question
2. **User B** finds an item and posts it as "FOUND"
3. **System automatically matches** them (if similarity ≥ 60%)
4. **User B** is asked the security question
5. **If correct answer** → Both users get each other's contact details

---

## 📊 Step-by-Step Flow

### Step 1: User Loses an Item

**User A (Lost User):**
```
Posts Lost Item:
- Title: "Blue iPhone 13"
- Category: Electronics
- Color: Blue
- Location: Main Campus Library
- Date: Nov 20, 2025
- Security Question: "What is the phone's wallpaper?"
- Security Answer: "sunset beach"
```

**Database:**
- Stores lost post
- Hashes security answer with bcrypt
- Status: "active"

---

### Step 2: User Finds an Item

**User B (Found User):**
```
Posts Found Item:
- Title: "Blue iPhone"
- Category: Electronics
- Color: Blue
- Location: Library
- Date: Nov 20, 2025
```

**System Automatically:**
1. ✅ Runs matching algorithm against all lost items
2. ✅ Calculates similarity score:
   - Category match: 30% ✓ (Electronics = Electronics)
   - Color match: 20% ✓ (Blue = Blue)
   - Date proximity: 20% ✓ (Same day)
   - Text similarity: 20% ✓ ("iPhone" in both)
   - Location match: 10% ✓ (Library matches)
   - **Total Score: 100%** ✅

3. ✅ Since 100% ≥ 60% threshold:
   - Creates match record
   - Sends notification to **User B (Found User)**:
     ```
     "Your found item 'Blue iPhone' matches a lost item 
     'Blue iPhone 13'. Answer the security question to claim."
     ```

---

### Step 3: Found User Answers Security Question

**User B sees:**
```
Match Found!
Lost Item: "Blue iPhone 13"
Security Question: "What is the phone's wallpaper?"

[Answer Field]: _____________
[Submit Answer]
```

**User B enters:** "sunset beach"

---

### Step 4: System Verifies Answer

**Backend Process:**
1. ✅ Receives answer: "sunset beach"
2. ✅ Converts to lowercase and trims: "sunset beach"
3. ✅ Compares with bcrypt hash
4. ✅ Answer is correct!

---

### Step 5: Contact Details Exchanged

**User A (Lost User) receives notification:**
```
📧 Item Found! Contact Details Inside

Great news! Someone found your lost item "Blue iPhone 13" 
and answered the security question correctly.

Contact: Jane Smith
Email: jane.smith@nie.ac.in
Phone: +91-9876543210
```

**User B (Found User) receives notification:**
```
✅ Correct Answer! Contact Owner

You correctly answered the security question for 
"Blue iPhone 13".

Lost item owner: John Doe
Email: john.doe@nie.ac.in
Phone: +91-9123456789
```

**API Response to User B:**
```json
{
  "success": true,
  "message": "Correct answer! Contact details exchanged.",
  "lostOwnerContact": {
    "name": "John Doe",
    "email": "john.doe@nie.ac.in",
    "phone": "+91-9123456789"
  },
  "yourDetails": {
    "name": "Jane Smith",
    "email": "jane.smith@nie.ac.in",
    "phone": "+91-9876543210"
  },
  "note": "Both you and the lost item owner have been notified with each other's contact details."
}
```

---

## ⚙️ Technical Implementation

### 1. Matching Threshold Updated

**File:** `backend/src/utils/matching.js`

**Before:**
```javascript
if (score.total >= 0.5) { // 50% threshold
```

**After:**
```javascript
if (score.total >= 0.6) { // 60% threshold
```

---

### 2. Notification Flow Changed

**Before:** Lost user was notified  
**After:** Found user is notified to answer security question

**File:** `backend/src/utils/matching.js`

```javascript
// Create notification for found post owner to answer security question
await Notification.create({
  user: foundPost.owner, // ← Found user (not lost user)
  type: 'match',
  title: 'Potential Match Found!',
  message: `Your found item "${foundPost.title}" matches a lost item "${match.lostPost.title}". Answer the security question to claim.`,
  relatedPost: match.lostPost._id // ← Points to lost post
});
```

---

### 3. Claim Endpoint Enhanced

**File:** `backend/src/controllers/postController.js`

**New Features:**
- ✅ Gets claimer (found user) details from database
- ✅ Sends notification to lost user with found user credentials
- ✅ Sends notification to found user with lost user credentials
- ✅ Returns both contacts in API response

**API Endpoint:**
```
POST /api/posts/:lostId/claim
Body: { "answer": "security answer" }
```

---

## 🎯 Matching Algorithm Details

### Scoring Breakdown:

| Factor | Weight | Example |
|--------|--------|---------|
| **Category Match** | 30% | Electronics = Electronics ✓ |
| **Color Match** | 20% | "blue" contains "blue" ✓ |
| **Date Proximity** | 20% | Same day = 100%, 7 days = 0% |
| **Text Similarity** | 20% | "iPhone 13" vs "iPhone" = 75% |
| **Location Match** | 10% | "Library" contains "Library" ✓ |

### Threshold:
- **Minimum Score:** 60%
- **Top Matches:** Best 3 matches saved
- **Notification:** Sent only for matches ≥ 60%

---

## 📱 User Experience Flow

### For Found User (Finder):

1. **Posts found item**
   ```
   "I found a blue iPhone near the library"
   ```

2. **Receives notification**
   ```
   "Match found! Answer security question to claim."
   ```

3. **Clicks notification → Sees security question**
   ```
   "What is the phone's wallpaper?"
   ```

4. **Enters answer → Submits**

5. **If correct:**
   ```
   ✅ Success! Contact the owner:
   John Doe - john.doe@nie.ac.in - +91-9123456789
   ```

6. **If wrong:**
   ```
   ❌ Incorrect answer. Attempt logged.
   ```

---

### For Lost User (Owner):

1. **Posts lost item with security question**
   ```
   "Lost blue iPhone 13"
   Security Q: "What is the wallpaper?"
   Security A: "sunset beach"
   ```

2. **Waits...**

3. **Receives notification when someone finds it**
   ```
   ✅ Item Found! Contact Details Inside
   
   Jane Smith found your item and answered correctly.
   Contact: jane.smith@nie.ac.in, +91-9876543210
   ```

4. **Can now contact the finder**

---

## 🔒 Security Features

### Protection Against Fraud:

1. **Security Answer Hashing:**
   - Answers stored as bcrypt hash (10 rounds)
   - Cannot be reversed or read from database

2. **Claim Attempt Logging:**
   - All attempts logged with user ID and timestamp
   - Wrong attempts notify lost user

3. **Case-Insensitive Matching:**
   - "Sunset Beach" = "sunset beach" = "SUNSET BEACH"
   - Prevents case mismatch issues

4. **Whitespace Trimming:**
   - "  sunset beach  " = "sunset beach"
   - Prevents accidental spaces

---

## 🗄️ Database Schema

### Match Collection:
```javascript
{
  _id: ObjectId,
  lostPost: ObjectId,      // Reference to lost post
  foundPost: ObjectId,     // Reference to found post
  score: 0.85,            // Match score (60-100%)
  matchDetails: {
    categoryMatch: true,
    colorMatch: true,
    dateProximity: 1.0,
    textSimilarity: 0.75,
    locationMatch: true
  },
  createdAt: Date
}
```

### Notification Collection:
```javascript
{
  _id: ObjectId,
  user: ObjectId,          // Recipient
  type: 'match' | 'claim',
  title: "Potential Match Found!",
  message: "Your found item matches...",
  relatedPost: ObjectId,   // Link to post
  read: false,
  createdAt: Date
}
```

---

## 🧪 Testing the New Flow

### Test Scenario 1: Successful Match (>60%)

**Step 1:** Create lost post
```bash
POST /api/posts
{
  "type": "lost",
  "title": "Red Backpack",
  "category": "Accessories",
  "color": "Red",
  "location": "Cafeteria",
  "securityQuestion": "What's inside the front pocket?",
  "securityAnswer": "keys"
}
```

**Step 2:** Create found post (triggers matching)
```bash
POST /api/posts
{
  "type": "found",
  "title": "Red Bag",
  "category": "Accessories",
  "color": "Red",
  "location": "Cafeteria"
}
```

**Expected:** 
- Match score ≥ 60%
- Found user gets notification

**Step 3:** Answer security question
```bash
POST /api/posts/{lostPostId}/claim
{
  "answer": "keys"
}
```

**Expected:**
- Both users get notifications
- Contact details exchanged

---

### Test Scenario 2: No Match (<60%)

**Lost Item:**
```
Blue iPhone 13, Electronics, Main Campus
```

**Found Item:**
```
Red Wallet, Accessories, Sports Complex
```

**Expected:**
- Match score < 60%
- No notification sent
- No security question asked

---

### Test Scenario 3: Wrong Answer

**Found user answers:** "charger"  
**Correct answer:** "keys"

**Expected:**
- API response: `{ success: false, message: "Incorrect answer" }`
- Lost user gets notification: "Claim attempt failed"
- Attempt logged in database
- Contact details NOT revealed

---

## 📊 API Endpoints Summary

### Get Matches for a Post
```
GET /api/posts/:postId/matches
Authorization: Bearer {token}
```

**Response:**
```json
{
  "matches": [
    {
      "lostPost": {...},
      "foundPost": {...},
      "score": 0.85,
      "matchDetails": {...}
    }
  ]
}
```

### Claim Lost Post
```
POST /api/posts/:lostId/claim
Authorization: Bearer {token}
Body: { "answer": "security answer" }
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Correct answer! Contact details exchanged.",
  "lostOwnerContact": {
    "name": "John Doe",
    "email": "john.doe@nie.ac.in",
    "phone": "+91-9123456789"
  },
  "yourDetails": {
    "name": "Jane Smith",
    "email": "jane.smith@nie.ac.in",
    "phone": "+91-9876543210"
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "message": "Incorrect answer. Request logged."
}
```

---

## ✅ Summary of Changes

### What Changed:

1. ✅ **Threshold increased** from 50% → 60%
2. ✅ **Notification target changed** from lost user → found user
3. ✅ **Claim flow enhanced** to send both contacts
4. ✅ **Notifications improved** with detailed contact info
5. ✅ **API response updated** with both user details

### What Stayed the Same:

- ✅ Security answer hashing (bcrypt)
- ✅ Claim attempt logging
- ✅ Match scoring algorithm
- ✅ Post creation flow
- ✅ Authentication system

---

## 🎯 Benefits of New Flow

### For Users:
- ✅ **Faster reunification** - Automatic matching
- ✅ **More secure** - Security question verification
- ✅ **Direct contact** - Both parties get details immediately
- ✅ **Higher accuracy** - 60% threshold reduces false matches

### For System:
- ✅ **Reduced spam** - Higher threshold = fewer notifications
- ✅ **Better matches** - Only quality matches processed
- ✅ **Complete audit trail** - All attempts logged
- ✅ **Automated workflow** - No manual intervention needed

---

## 📖 MongoDB Compass Connection

**See:** `MONGODB_COMPASS_GUIDE.md` for complete setup instructions

### Quick Connection:

1. **Install MongoDB Compass**
2. **Connection String:** `mongodb://localhost:27017`
3. **Database:** `lost_found` (created automatically)
4. **Collections:**
   - `users` - User accounts
   - `posts` - Lost & found items
   - `matches` - Match results
   - `notifications` - User notifications

---

## 🚀 You're All Set!

Your app now has:
- ✅ 60% matching threshold
- ✅ Automatic security question flow
- ✅ Contact detail exchange
- ✅ MongoDB Compass ready

**Start testing the new flow!** 🎉
