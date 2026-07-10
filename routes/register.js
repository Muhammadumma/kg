// Registration Routes
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const ProfileCode = require('../models/ProfileCode');
const Registration = require('../models/Registration');

// POST /api/register - Register user with profile code
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, profileCode, profileData } = req.body;
    const userId = req.user.uid;

    // Validate required fields
    if (!name || !email || !phone || !profileCode) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'profileCode']
      });
    }

    // Step 1: Verify profile code from Firebase Firestore
    console.log(`Verifying profile code: ${profileCode}`);
    const codeVerification = await ProfileCode.verify(profileCode);
    
    if (!codeVerification.valid) {
      return res.status(400).json({ 
        error: codeVerification.message 
      });
    }

    // Step 2: Save registration to MySQL
    console.log(`Saving registration for user: ${userId}`);
    const registration = await Registration.create({
      name,
      email,
      phone,
      profileCode,
      userId,
      profileData: profileData || {}
    });

    // Step 3: Mark profile code as used in Firebase
    console.log(`Marking profile code ${profileCode} as used`);
    await ProfileCode.markAsUsed(profileCode, userId);

    // Success response
    return res.status(201).json({
      success: true,
      message: 'Registration completed successfully',
      data: {
        registrationId: registration.registrationId,
        userId: userId,
        name: name,
        email: email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Registration failed',
      details: error.message
    });
  }
});

// GET /api/register/:userId - Get user registration
router.get('/register/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can only access their own registration
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const registration = await Registration.getByUserId(userId);

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    return res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Error fetching registration:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch registration',
      details: error.message
    });
  }
});

// PUT /api/register/:userId - Update user registration
router.put('/register/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, profileData } = req.body;

    // Verify user can only update their own registration
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Registration.update(userId, {
      name,
      email,
      phone,
      profileData: profileData || {}
    });

    return res.json({
      success: true,
      message: 'Registration updated successfully'
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    return res.status(500).json({ 
      error: 'Failed to update registration',
      details: error.message
    });
  }
});

module.exports = router;