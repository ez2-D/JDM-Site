<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

session_start();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>