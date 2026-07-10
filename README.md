# KG Registration System

A complete registration system with dual-database architecture:
- **Firebase Firestore**: Profile code verification and authentication
- **MySQL**: Registration data storage

## Architecture

```
Frontend (HTML/JS/CSS)
        ↓
    Firebase Auth (Token)
        ↓
    Node.js/Express Backend
        ↓
    Firebase Firestore (Code Verification) + MySQL (Data Storage)
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 3. Setup MySQL Database
```bash
mysql -u root -p < database/schema.sql
```

### 4. Setup Firebase
- Download `serviceAccountKey.json` from Firebase Console
- Place it in the project root

### 5. Run Server
```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/register
Register a new user.

**Headers:**
```
Authorization: Bearer <Firebase-Token>
Content-Type: application/json
```

**Body:**
```json
{
  "profileCode": "CODE123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "profileData": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration completed successfully",
  "data": {
    "registrationId": 1,
    "userId": "firebase-uid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET /api/register/:userId
Get user registration details.

**Headers:**
```
Authorization: Bearer <Firebase-Token>
```

### PUT /api/register/:userId
Update user registration.

**Headers:**
```
Authorization: Bearer <Firebase-Token>
Content-Type: application/json
```

## File Structure

```
kg/
├── config/
│   ├── firebase.js          # Firebase Admin initialization
│   └── database.js          # MySQL connection pool
├── middleware/
│   └── auth.js              # Firebase token verification
├── models/
│   ├── ProfileCode.js       # Firebase Firestore operations
│   └── Registration.js      # MySQL operations
├── routes/
│   └── register.js          # API endpoints
├── database/
│   └── schema.sql           # MySQL schema
├── public/
│   ├── index.html           # Frontend form
│   ├── app.js               # Frontend logic
│   ├── firebase-config.js   # Firebase client config
│   └── styles.css           # Styling
├── server.js                # Express server
├── package.json             # Dependencies
└── .env.example             # Environment variables template
```

## Flow Diagram

1. User enters profile code and personal info in the form
2. Frontend gets Firebase ID token
3. Frontend sends registration request to backend with token
4. Backend verifies Firebase token
5. Backend checks if profile code is valid in Firestore
6. Backend saves registration to MySQL
7. Backend marks profile code as used in Firestore
8. Backend returns success response to frontend

## Security

- ✅ Firebase token verification on all protected endpoints
- ✅ Profile code validation in Firestore
- ✅ One-time use codes (marked as used after registration)
- ✅ User ID from Firebase token (cannot be spoofed)
- ✅ CORS configured for frontend domain

## Environment Variables

See `.env.example` for required configuration.

## License

MIT