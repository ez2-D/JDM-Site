<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// В реальном проекте здесь должна быть проверка JWT токена
// Для упрощения будем использовать сессии

session_start();

if (isset($_SESSION['user_id'])) {
    include_once '../../config/database.php';
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT id, email, username, first_name, last_name, role FROM users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $_SESSION['user_id']);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    } catch(PDOException $exception) {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
}
?>