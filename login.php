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
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT id, email, password_hash, username, first_name, last_name, role, is_active 
                  FROM users 
                  WHERE email = :email AND is_active = TRUE";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($password, $user['password_hash'])) {
                // Обновляем время последнего входа
                $updateQuery = "UPDATE users SET last_login = NOW() WHERE id = :id";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->bindParam(':id', $user['id']);
                $updateStmt->execute();
                
                // Создаем токен (в реальном проекте используйте JWT)
                $token = bin2hex(random_bytes(32));
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Вход выполнен успешно',
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'username' => $user['username'],
                        'firstName' => $user['first_name'],
                        'lastName' => $user['last_name'],
                        'role' => $user['role']
                    ],
                    'token' => $token
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Неверный пароль']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
        }
        
    } catch(PDOException $exception) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $exception->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>