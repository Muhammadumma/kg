// Frontend Registration Logic
import { auth } from './firebase-config.js';
import { signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const registrationForm = document.getElementById('registrationForm');
const messageDiv = document.getElementById('message');

// Sign in user (if needed)
async function ensureUserSignedIn() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
      console.log('User signed in anonymously');
    } catch (error) {
      console.error('Error signing in:', error);
      showMessage('Authentication failed', 'error');
    }
  }
}

// Get Firebase ID token
async function getToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken(true);
}

// Handle form submission
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    // Ensure user is signed in
    await ensureUserSignedIn();
    
    // Get form data
    const formData = {
      profileCode: document.getElementById('profileCode').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      profileData: {
        timestamp: new Date().toISOString()
      }
    };
    
    // Get Firebase token
    const token = await getToken();
    
    // Send registration to backend API
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showMessage(data.error || 'Registration failed', 'error');
      return;
    }
    
    showMessage(`Success! Your registration ID: ${data.data.registrationId}`, 'success');
    registrationForm.reset();
    
  } catch (error) {
    console.error('Registration error:', error);
    showMessage(error.message || 'An error occurred', 'error');
  }
});

// Show message to user
function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.textContent = '';
    }, 5000);
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  ensureUserSignedIn();
});