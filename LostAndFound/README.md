# NIE Lost & Found

A React Native mobile application for National Institute of Engineering's Lost and Found board. This app helps students and staff report and find lost items on campus.

## Features

✅ **Email Validation**: Only accepts @nie.ac.in email addresses for registration
✅ **User Authentication**: Secure login and registration system
✅ **Local Storage**: All data stored locally using AsyncStorage
✅ **Tab-based Navigation**: Easy navigation between different sections
✅ **Lost Items Board**: Report and browse lost items
✅ **Found Items Board**: Report and browse found items
✅ **Post Items**: Create new lost or found item listings
✅ **User Profile**: View your account information
✅ **Delete Items**: Users can delete their own posted items

## Tech Stack

- **React Native** with Expo
- **React Navigation** (Bottom Tabs & Stack Navigator)
- **AsyncStorage** for local data persistence
- **React Native Safe Area Context** for safe area handling

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the app:
```bash
npm start
```

3. Run on your device:
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Web**: Press `w` to open in browser

## Project Structure

```
LostAndFound/
├── App.js                          # Main app entry point
├── src/
│   ├── navigation/
│   │   ├── AuthNavigator.js       # Authentication flow navigation
│   │   └── TabNavigator.js        # Bottom tab navigation
│   ├── screens/
│   │   ├── LoginScreen.js         # Login screen
│   │   ├── RegisterScreen.js      # Registration screen
│   │   ├── LostScreen.js          # Lost items list
│   │   ├── FoundScreen.js         # Found items list
│   │   ├── PostScreen.js          # Post new item
│   │   └── ProfileScreen.js       # User profile
│   └── utils/
│       └── storage.js             # AsyncStorage utilities
└── package.json
```

## Usage

### Registration
1. Open the app
2. Tap "Register" on the login screen
3. Enter your details with a valid @nie.ac.in email
4. Create a password (minimum 6 characters)
5. Tap "Register" to create your account

### Login
1. Enter your @nie.ac.in email
2. Enter your password
3. Tap "Sign In"

### Posting an Item
1. Navigate to the "Post" tab (➕ icon)
2. Select item type (Lost or Found)
3. Enter item name, description, and location
4. Tap "Post Item"

### Viewing Items
- **Lost Tab** (🔍): View all reported lost items
- **Found Tab** (✅): View all reported found items
- Pull down to refresh the list

### Deleting Items
- Only your own posted items will show a "Delete" button
- Tap "Delete" and confirm to remove the item

### Profile
- View your account information
- See your member since date
- Logout from your account

## Email Validation

The app strictly validates email addresses to ensure only users with @nie.ac.in email addresses can register and use the app. Examples:
- ✅ `student@nie.ac.in`
- ✅ `john.doe@nie.ac.in`
- ❌ `student@gmail.com`
- ❌ `user@nie.com`

## Data Storage

All data is stored locally on your device using AsyncStorage:
- User credentials and profile information
- Lost items database
- Found items database

**Note**: Data is not synced across devices. Each device maintains its own local database.

## Screenshots

The app features:
- Clean, modern UI with color-coded sections
- Easy-to-use tab navigation
- Smooth animations and transitions
- Responsive design for all screen sizes

## Development

Built with:
- React Native 0.81.5
- Expo ~54.0.25
- React 19.1.0
- React Navigation 6.x

## License

© 2025 National Institute of Engineering

---

**Note**: This is a local-only app. For a production environment, consider implementing:
- Backend API for data synchronization
- Secure password hashing
- Push notifications
- Image upload for items
- Search and filter functionality
- Chat/messaging between users
