<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Неверный формат email']);
        exit;
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT id, email, first_name FROM users WHERE email = :email AND is_active = TRUE";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Генерируем токен сброса пароля
            $resetToken = bin2hex(random_bytes(32));
            $resetTokenExpires = date('Y-m-d H:i:s', strtotime('+1 hour')); // Токен действует 1 час
            
            // Сохраняем токен в БД
            $updateQuery = "UPDATE users SET reset_token = :reset_token, reset_token_expires = :reset_token_expires WHERE id = :id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':reset_token', $resetToken);
            $updateStmt->bindParam(':reset_token_expires', $resetTokenExpires);
            $updateStmt->bindParam(':id', $user['id']);
            
            if ($updateStmt->execute()) {
                // В реальном проекте здесь отправляется email
                // Для демонстрации просто возвращаем токен
                $resetLink = "http://localhost/jdm-site/reset-password.html?token=" . $resetToken;
                
                // Логируем ссылку (в продакшене отправляем email)
                error_log("Password reset link for {$email}: {$resetLink}");
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Ссылка для сброса пароля отправлена на ваш email',
                    'debug_link' => $resetLink // Убрать в продакшене
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Ошибка при генерации токена']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Пользователь с таким email не найден']);
        }
        
    } catch(PDOException $exception) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $exception->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>