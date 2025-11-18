<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Подтверждение email по токену из ссылки
    $token = $_GET['token'] ?? '';
    
    if (empty($token)) {
        echo json_encode(['success' => false, 'message' => 'Неверная ссылка подтверждения']);
        exit;
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT id FROM users WHERE verification_token = :token AND is_active = TRUE";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Активируем аккаунт и очищаем токен
            $updateQuery = "UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE id = :id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':id', $user['id']);
            
            if ($updateStmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Email успешно подтвержден! Теперь вы можете войти в систему.'
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Ошибка при подтверждении email']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Неверная или устаревшая ссылка подтверждения']);
        }
        
    } catch(PDOException $exception) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $exception->getMessage()]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Повторная отправка письма подтверждения
    $data = json_decode(file_get_contents("php://input"));
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT id, email, verification_token FROM users WHERE email = :email AND is_active = TRUE AND email_verified = FALSE";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Генерируем новую ссылку подтверждения
            $verificationLink = "http://localhost/jdm-site/api/auth/verify-email.php?token=" . $user['verification_token'];
            
            // Логируем ссылку (в продакшене отправляем email)
            error_log("Verification link for {$email}: {$verificationLink}");
            
            echo json_encode([
                'success' => true,
                'message' => 'Ссылка для подтверждения email отправлена повторно',
                'debug_link' => $verificationLink // Убрать в продакшене
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Аккаунт не найден или уже подтвержден']);
        }
        
    } catch(PDOException $exception) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $exception->getMessage()]);
    }
}
?>