// ============================================
// FIREBASE SQL INTEGRATION
// Connect to your Firebase SQL database
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getDatabase, ref, get, update, push } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCPu0O-P9K-dpxQRV48bGU_2fBhFQ1rQGo",
    authDomain: "registration-eb4fb.firebaseapp.com",
    projectId: "registration-eb4fb",
    databaseURL: "https://registration-eb4fb-default-rtdb.firebaseio.com",
    storageBucket: "registration-eb4fb.firebasestorage.app",
    messagingSenderId: "667932382366",
    appId: "1:667932382366:web:214fc844f7313c59ac578f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// ============================================
// 1. VERIFY PROFILE CODE
// ============================================
export async function verifyCode(codeId) {
    try {
        const codeRef = ref(database, `ProfileCode/${codeId}`);
        const snapshot = await get(codeRef);
        
        if (!snapshot.exists()) {
            return { success: false, error: 'Code not found' };
        }
        
        const code = snapshot.val();
        
        if (code.used) {
            return { success: false, error: 'Code already used' };
        }
        
        return { success: true, data: code };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// 2. REGISTER STUDENT & MARK CODE USED
// ============================================
export async function registerStudent(codeId, studentData) {
    try {
        // Verify code first
        const verification = await verifyCode(codeId);
        if (!verification.success) {
            return verification;
        }
        
        // Create registration
        const registrationRef = ref(database, 'Registration');
        const newRegRef = push(registrationRef);
        
        await update(newRegRef, {
            codeId: codeId,
            fullName: studentData.fullName,
            email: studentData.email,
            phone: studentData.phone,
            course: studentData.course || '',
            session: studentData.session || '',
            registeredAt: new Date().toISOString(),
            status: 'pending'
        });
        
        // Mark code as used
        const codeRef = ref(database, `ProfileCode/${codeId}`);
        await update(codeRef, {
            used: true,
            usedAt: new Date().toISOString(),
            usedByRef: newRegRef.key
        });
        
        return {
            success: true,
            registrationId: newRegRef.key,
            message: 'Registration successful'
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// 3. GET CODE STATISTICS
// ============================================
export async function getCodeStats() {
    try {
        const codesRef = ref(database, 'ProfileCode');
        const snapshot = await get(codesRef);
        
        if (!snapshot.exists()) {
            return { total: 0, used: 0, available: 0 };
        }
        
        const codes = snapshot.val();
        let total = 0;
        let used = 0;
        
        Object.values(codes).forEach(code => {
            total++;
            if (code.used) {
                used++;
            }
        });
        
        return {
            total: total,
            used: used,
            available: total - used
        };
    } catch (error) {
        console.error('Stats error:', error);
        return { total: 0, used: 0, available: 0 };
    }
}

// ============================================
// 4. GET ALL PROFILE CODES
// ============================================
export async function getAllCodes() {
    try {
        const codesRef = ref(database, 'ProfileCode');
        const snapshot = await get(codesRef);
        
        if (!snapshot.exists()) {
            return [];
        }
        
        const codes = [];
        Object.entries(snapshot.val()).forEach(([key, value]) => {
            codes.push({
                codeId: key,
                ...value
            });
        });
        
        return codes;
    } catch (error) {
        console.error('Error fetching codes:', error);
        return [];
    }
}

// ============================================
// 5. SIGN IN USER
// ============================================
export async function signInUser() {
    try {
        await signInAnonymously(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export { auth, database };
