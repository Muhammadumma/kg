// Registration Model - MySQL
const pool = require('../config/database');

class Registration {
  // Create new registration
  static async create(registrationData) {
    const connection = await pool.getConnection();
    
    try {
      const { name, email, phone, profileCode, userId, profileData } = registrationData;
      
      const [result] = await connection.execute(
        'INSERT INTO registrations (name, email, phone, profile_code, user_id, profile_data, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [name, email, phone, profileCode, userId, JSON.stringify(profileData)]
      );

      return { 
        success: true, 
        registrationId: result.insertId,
        message: 'Registration created successfully'
      };
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get registration by user ID
  static async getByUserId(userId) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM registrations WHERE user_id = ?',
        [userId]
      );
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching registration:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update registration
  static async update(userId, updateData) {
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(
        'UPDATE registrations SET name = ?, email = ?, phone = ?, profile_data = ?, updated_at = NOW() WHERE user_id = ?',
        [updateData.name, updateData.email, updateData.phone, JSON.stringify(updateData.profileData), userId]
      );

      return { success: true, message: 'Registration updated successfully' };
    } catch (error) {
      console.error('Error updating registration:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Registration;