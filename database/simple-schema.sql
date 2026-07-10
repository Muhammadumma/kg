-- ============================================
-- KOWAGURU REGISTRATION DATABASE
-- Simple Version - Just Codes + Registrations
-- ============================================

CREATE DATABASE IF NOT EXISTS kowaguru_registration;
USE kowaguru_registration;

-- ============================================
-- PROFILE CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profile_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at DATETIME NULL,
    used_by VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_used (used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ref VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    course VARCHAR(255) NULL,
    session VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_email (email),
    INDEX idx_ref (ref)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT SAMPLE CODES
-- ============================================
INSERT INTO profile_codes (code) VALUES 
('KG-2026-0001'),
('KG-2026-0002'),
('KG-2026-0003'),
('KG-2026-0004'),
('KG-2026-0005'),
('KG-2026-0006'),
('KG-2026-0007'),
('KG-2026-0008'),
('KG-2026-0009'),
('KG-2026-0010');