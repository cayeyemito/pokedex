<?php
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
require 'db.php';

// Preparar el call al procedimiento (sin parámetros)
$stmt = $conn->prepare("CALL obtener_pokemons()");

if (!$stmt) {
    error_log("Error al preparar statement: " . $conn->error);
    echo json_encode([
        "success" => false,
        "message" => "Error interno del servidor"
    ]);
    exit;
}

// Ejecutar
$stmt->execute();

// Obtener resultados
$result = $stmt->get_result();

if ($result && ($row = $result->fetch_assoc())) {
    $pokesJson = $row['pokes_json'] ?: '[]';
    $total     = (int)$row['total_pokemons'];

    echo <<<JS
{
  "success": true,
  "data": $pokesJson,
  "total_pokemons": $total
}
JS;
} else {
    echo json_encode([
        "success" => true,
        "data" => [],
        "total_pokemons" => 0
    ]);
}

$stmt->close();
$conn->close();
