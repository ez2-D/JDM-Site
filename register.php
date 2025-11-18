<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    $password = $data->password;
    $username = htmlspecialchars(strip_tags($data->username));
    $firstName = htmlspecialchars(strip_tags($data->firstName));
    $lastName = htmlspecialchars(strip_tags($data->lastName));
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Неверный формат email']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Пароль должен быть не менее 6 символов']);
        exit;
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        // Проверяем, существует ли пользователь
        $checkQuery = "SELECT id FROM users WHERE email = :email";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Пользователь с таким email уже существует']);
            exit;
        }
        
        // Хэшируем пароль
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $verificationToken = bin2hex(random_bytes(32));
        
        // Создаем пользователя
        $query = "INSERT INTO users 
                  SET email=:email, password_hash=:password_hash, username=:username, 
                      first_name=:first_name, last_name=:last_name, verification_token=:verification_token";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password_hash', $passwordHash);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':verification_token', $verificationToken);
        
        if ($stmt->execute()) {
            // Здесь можно отправить email с подтверждением
            echo json_encode([
                'success' => true, 
                'message' => 'Регистрация успешна! Вы можете войти в систему.'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ошибка при регистрации']);
        }
        
    } catch(PDOException $exception) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $exception->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
// После успешной регистрации
if ($stmt->execute()) {
    // Отправляем email с подтверждением (в демо просто логируем)
    $verificationLink = "http://localhost/jdm-site/api/auth/verify-email.php?token=" . $verificationToken;
    error_log("Verification link for {$email}: {$verificationLink}");
    
    echo json_encode([
        'success' => true, 
        'message' => 'Регистрация успешна! На ваш email отправлена ссылка для подтверждения.',
        'debug_link' => $verificationLink // Убрать в продакшене
    ]);
}
?>