# 🎓 KowaGuru Simple Registration System

## What This Does

✅ **Verify Profile Codes** - Check if code exists in database  
✅ **Count Used Tokens** - Track how many codes have been used  
✅ **Save Registrations** - Store student data in SQL database  
✅ **Update Firebase** - Mark codes as used automatically

---

## Setup (5 minutes)

### 1️⃣ Create Database

```bash
mysql -u root -p < database/simple-schema.sql
```

This creates:
- `profile_codes` table with sample codes
- `registrations` table for student data

### 2️⃣ Setup PHP API

1. Copy `api.php` to your web server (Apache/Nginx)
2. Update database credentials if needed:
   ```php
   define('DB_HOST', 'localhost');  // Your host
   define('DB_NAME', 'kowaguru_registration');  // Your DB
   define('DB_USER', 'root');  // Your user
   define('DB_PASS', '');  // Your password
   ```

### 3️⃣ Setup Frontend

1. Copy `public/simple-form.html` to your web server
2. Update API_URL if needed:
   ```javascript
   const API_URL = 'api.php';  // Change if on different path
   ```

### 4️⃣ Test It

Open in browser: `http://localhost/simple-form.html`

Try code: `KG-2026-0001`

---

## API Endpoints

### Verify Code
```bash
curl -X POST http://localhost/api.php?action=verify \
  -d "code=KG-2026-0001"
```

**Response:**
```json
{
  "success": true,
  "message": "Code verified",
  "codeId": 1
}
```

### Register Student
```bash
curl -X POST http://localhost/api.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "code": "KG-2026-0001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+2348012345678",
    "course": "Web Development",
    "session": "Weekend Morning"
  }'
```

**Response:**
```json
{
  "success": true,
  "ref": "KG-2026-A1B2C3",
  "counts": {
    "total": 10,
    "used": 2,
    "available": 8
  }
}
```

### Get Counts
```bash
curl http://localhost/api.php?action=counts
```

**Response:**
```json
{
  "success": true,
  "counts": {
    "total": 10,
    "used": 2,
    "available": 8
  }
}
```

---

## Database Schema

### Profile Codes Table
```sql
profile_codes
├── id                INT (auto)
├── code              VARCHAR (unique)
├── used              BOOLEAN
├── used_at           DATETIME (when used)
├── used_by           VARCHAR (name of person)
└── created_at        DATETIME
```

### Registrations Table
```sql
registrations
├── id                INT (auto)
├── ref               VARCHAR (unique reference code)
├── code              VARCHAR (the code used)
├── full_name         VARCHAR
├── email             VARCHAR
├── phone             VARCHAR
├── course            VARCHAR
├── session           VARCHAR
└── created_at        DATETIME
```

---

## How It Works

```
1. User enters profile code
   ↓
2. api.php?action=verify checks database
   ↓
3. If valid → show registration form
   ↓
4. User fills form and submits
   ↓
5. api.php?action=register:
   - Saves to registrations table
   - Marks code as used in profile_codes
   - Returns counts
   ↓
6. Show success with reference code
```

---

## Add More Codes

```sql
INSERT INTO profile_codes (code) VALUES 
('KG-2026-0011'),
('KG-2026-0012'),
('KG-2026-0013');
```

---

## View Registrations

```sql
SELECT ref, code, full_name, email, created_at 
FROM registrations 
ORDER BY created_at DESC;
```

---

## Check Counts

```sql
SELECT 
  COUNT(*) as total_codes,
  SUM(used) as used_codes,
  COUNT(*) - SUM(used) as available_codes
FROM profile_codes;
```

---

## Firebase Sync (Optional)

To sync codes from Firebase to SQL:

```javascript
// In browser console
async function syncFromFirebase() {
  const snapshot = await db.collection('profileCodes').get();
  const codes = [];
  
  snapshot.forEach(doc => {
    codes.push(doc.id);
  });
  
  console.log('Codes to sync:', codes);
  
  // Insert into SQL manually or via API
  for (let code of codes) {
    // INSERT INTO profile_codes (code) VALUES (code)
  }
}

syncFromFirebase();
```

---

## Summary

- ✅ Simple verification system
- ✅ Automatic counting
- ✅ One-time use codes
- ✅ No complex backend
- ✅ Fast and reliable

That's it! 🚀