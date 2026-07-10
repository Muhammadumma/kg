<?php
// ============================================
// SIMPLE API - Verify & Count Codes
// ============================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit(0);

// Database config
define('DB_HOST', 'localhost');
define('DB_NAME', 'kowaguru_registration');
define('DB_USER', 'root');
define('DB_PASS', '');

// ============================================
// DATABASE CONNECTION
// ============================================
function getDB() {
    try {
        return new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    } catch (PDOException $e) {
        die(json_encode(['success' => false, 'error' => 'DB Connection Error']));
    }
}

// ============================================
// API ENDPOINTS
// ============================================
$action = $_GET['action'] ?? '';

switch ($action) {
    
    // ----------------------------------------
    // 1. VERIFY CODE
    // ----------------------------------------
    case 'verify':
        $code = $_POST['code'] ?? '';
        
        if (empty($code)) {
            echo json_encode(['success' => false, 'error' => 'Code required']);
            exit;
        }
        
        $db = getDB();
        $stmt = $db->prepare("SELECT id, used FROM profile_codes WHERE code = ? LIMIT 1");
        $stmt->execute([$code]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$result) {
            echo json_encode(['success' => false, 'error' => 'Invalid code']);
        } elseif ($result['used'] == 1) {
            echo json_encode(['success' => false, 'error' => 'Code already used']);
        } else {
            echo json_encode(['success' => true, 'message' => 'Code verified', 'codeId' => $result['id']]);
        }
        break;
    
    // ----------------------------------------
    // 2. REGISTER & UPDATE COUNTS
    // ----------------------------------------
    case 'register':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            echo json_encode(['success' => false, 'error' => 'Invalid request']);
            exit;
        }
        
        $db = getDB();
        
        try {
            $db->beginTransaction();
            
            // Verify code is still available
            $stmt = $db->prepare("SELECT used FROM profile_codes WHERE code = ? FOR UPDATE");
            $stmt->execute([$data['code']]);
            $codeCheck = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$codeCheck || $codeCheck['used'] == 1) {
                throw new Exception('Code invalid or already used');
            }
            
            // Generate reference
            $ref = 'KG-' . date('Y') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));
            
            // Save registration
            $stmt = $db->prepare("
                INSERT INTO registrations (ref, code, full_name, email, phone, course, session)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $ref,
                $data['code'],
                $data['full_name'],
                $data['email'],
                $data['phone'],
                $data['course'] ?? '',
                $data['session'] ?? ''
            ]);
            
            // Mark code as used
            $stmt = $db->prepare("
                UPDATE profile_codes 
                SET used = 1, used_at = NOW(), used_by = ?
                WHERE code = ?
            ");
            $stmt->execute([$data['full_name'], $data['code']]);
            
            $db->commit();
            
            // Get updated counts
            $stmt = $db->query("SELECT COUNT(*) as total, SUM(used) as used_count FROM profile_codes");
            $counts = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'Registration successful',
                'ref' => $ref,
                'counts' => [
                    'total' => (int)$counts['total'],
                    'used' => (int)$counts['used_count'],
                    'available' => (int)$counts['total'] - (int)$counts['used_count']
                ]
            ]);
            
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    
    // ----------------------------------------
    // 3. GET COUNTS
    // ----------------------------------------
    case 'counts':
        $db = getDB();
        $stmt = $db->query("SELECT COUNT(*) as total, SUM(used) as used_count FROM profile_codes");
        $counts = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'counts' => [
                'total' => (int)$counts['total'],
                'used' => (int)$counts['used_count'],
                'available' => (int)$counts['total'] - (int)$counts['used_count']
            ]
        ]);
        break;
    
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
?>