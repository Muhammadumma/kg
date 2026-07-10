// Profile Code Model - Firebase Firestore
const { db } = require('../config/firebase');

class ProfileCode {
  // Verify and get profile code from Firestore
  static async verify(code) {
    try {
      const doc = await db.collection('profileCodes').doc(code).get();
      
      if (!doc.exists) {
        return { valid: false, message: 'Profile code not found' };
      }

      const data = doc.data();
      
      if (data.used) {
        return { valid: false, message: 'Profile code already used' };
      }

      if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
        return { valid: false, message: 'Profile code expired' };
      }

      return { valid: true, data: data };
    } catch (error) {
      console.error('Error verifying profile code:', error);
      throw error;
    }
  }

  // Mark profile code as used
  static async markAsUsed(code, userId) {
    try {
      await db.collection('profileCodes').doc(code).update({
        used: true,
        usedBy: userId,
        usedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error marking code as used:', error);
      throw error;
    }
  }

  // Create new profile code
  static async create(code, expiresAt = null) {
    try {
      await db.collection('profileCodes').doc(code).set({
        code: code,
        used: false,
        createdAt: new Date(),
        expiresAt: expiresAt
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating profile code:', error);
      throw error;
    }
  }
}

module.exports = ProfileCode;