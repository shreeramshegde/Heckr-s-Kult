# Lost & Found Backend API

Node.js + Express + MongoDB backend for the NIE College Lost & Found application.

## Features

- RESTful API with Express
- MongoDB with Mongoose ODM
- JWT authentication
- File upload with Multer
- Image processing with Sharp
- Smart matching algorithm
- Rate limiting and security
- Comprehensive test suite

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@nie.ac.in",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john.doe@nie.ac.in",
    "isAdmin": false
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@nie.ac.in",
  "password": "password123"
}
```

### Posts Endpoints

#### Get All Posts
```http
GET /api/posts?type=lost&category=Electronics&page=1&limit=20
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

type: lost
title: Lost iPhone
description: Black iPhone 13 with blue case
category: Electronics
color: Black
location: Library
dateTime: 2025-11-20T10:00:00Z
securityQuestion: What's the wallpaper?
securityAnswer: mountain
image: [file]
```

#### Claim Lost Post
```http
POST /api/posts/{lostId}/claim
Authorization: Bearer {token}
Content-Type: application/json

{
  "answer": "mountain"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Correct answer! Here is the owner contact.",
  "ownerContact": {
    "name": "John Doe",
    "email": "john.doe@nie.ac.in",
    "phone": "9876543210"
  }
}
```

## Matching Algorithm

The matching algorithm calculates similarity scores between found and lost items:

```javascript
Score = (Category × 0.3) + (Color × 0.2) + (DateProximity × 0.2) + 
        (TextSimilarity × 0.2) + (Location × 0.1)
```

- **Category Match**: Exact match (30% weight)
- **Color Match**: Partial string match (20% weight)
- **Date Proximity**: Linear decay over 7 days (20% weight)
- **Text Similarity**: Levenshtein distance on title+description (20% weight)
- **Location Match**: Partial string match (10% weight)

Minimum threshold: 50%

## Environment Variables

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost_found
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:8081
COLLEGE_EMAIL_DOMAIN=@nie.ac.in
```

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique, @nie.ac.in),
  password: String (hashed),
  phone: String,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Post
```javascript
{
  type: 'lost' | 'found',
  title: String,
  description: String,
  category: String,
  color: String,
  location: String,
  dateTime: Date,
  image: String,
  thumbnail: String,
  owner: ObjectId (ref: User),
  securityQuestion: String,      // LOST only
  securityAnswerHash: String,    // LOST only
  status: 'active' | 'claimed' | 'closed',
  claimAttempts: Array,
  createdAt: Date
}
```

### Match
```javascript
{
  lostPost: ObjectId,
  foundPost: ObjectId,
  score: Number,
  matchDetails: {
    categoryMatch: Boolean,
    colorMatch: Boolean,
    dateProximity: Number,
    textSimilarity: Number,
    locationMatch: Boolean
  },
  notified: Boolean,
  createdAt: Date
}
```

## Security Features

1. **Email Validation**: Only @nie.ac.in emails allowed
2. **Password Hashing**: bcrypt with salt rounds 10
3. **JWT Tokens**: 7-day expiration
4. **Rate Limiting**:
   - General: 100 requests / 15 minutes
   - Auth: 5 requests / 15 minutes
   - Claim: 10 requests / hour
5. **Input Sanitization**: express-validator
6. **Security Headers**: Helmet
7. **CORS**: Configured for specific origins

## Testing

Run tests:
```bash
npm test
```

Test coverage includes:
- Authentication flow
- Email domain validation
- Password strength
- Matching algorithm accuracy
- Security question verification

## Error Handling

Standard error responses:

```json
{
  "error": "Error message here"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Rate Limiting

Default limits:
- Auth endpoints: 5 requests per 15 minutes
- Claim endpoint: 10 requests per hour
- Other endpoints: 100 requests per 15 minutes

Headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Deployment

1. Set `NODE_ENV=production`
2. Use secure `JWT_SECRET`
3. Enable HTTPS
4. Configure MongoDB Atlas
5. Set proper CORS origins
6. Use process manager (PM2)

```bash
npm install -g pm2
pm2 start src/index.js --name lost-found-api
```

## Support

For API issues or questions:
- Check logs: `pm2 logs lost-found-api`
- MongoDB issues: Verify connection string
- Auth issues: Check JWT_SECRET and token expiration
