<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $token = $data->token;
    $password = $data->password;
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Пароль должен быть не менее 6 символов']);
        exit;
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        // Проверяем токен и его срок действия
        $query = "SELECT id FROM users WHERE reset_token = :token AND reset_token_expires > NOW() AND is_active = TRUE";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Хэшируем новый пароль
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Обновляем пароль и очищаем токен
            $updateQuery = "UPDATE users SET password_hash = :password_hash, reset_token = NULL, reset_token_expires = NULL WHERE id = :id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':password_hash', $passwordHash);
            $updateStmt->bindParam(':id', $user['id']);
            
            if ($updateStmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Пароль успешно изменен'
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Ошибка при изменении пароля']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Неверная или просроченная ссылка для сброса пароля']);
        }
        
    } catch(PDOException $exception) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $exception->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>