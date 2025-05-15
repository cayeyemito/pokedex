<?php
include 'db.php';

header('Content-Type: application/json');
error_reporting(0); // Desactivar errores en producción

// Limpiar buffer de salida completamente
while (ob_get_level()) ob_end_clean();

$response = [];
$numero = null;

// Obtener número válido
if (isset($_REQUEST["numero"])) {
    $numero = filter_var($_REQUEST["numero"], FILTER_VALIDATE_INT, [
        'options' => [
            'min_range' => 10001,
            'max_range' => 10277 // Ajustar según tu rango de Pokémon
        ]
    ]);
}

if ($numero === false || $numero === null) {
    http_response_code(400);
    $response = [
        "status" => "error",
        "message" => "Número de Pokémon inválido"
    ];
    echo json_encode($response);
    exit();
}

if ($conn->connect_error) {
    http_response_code(500);
    $response = [
        "status" => "error",
        "message" => "Error de conexión a la base de datos"
    ];
    echo json_encode($response);
    exit();
}

// Usar WHERE en lugar de HAVING
$stmt = $conn->prepare("CALL ObtenerInfoCompletaPokemon('especial', ?, NULL);");
if (!$stmt) {
    http_response_code(500);
    $response = [
        "status" => "error",
        "message" => "Error en preparación de consulta: " . $conn->error
    ];
    echo json_encode($response);
    exit();
}

$stmt->bind_param("i", $numero);
if (!$stmt->execute()) {
    http_response_code(500);
    $response = [
        "status" => "error",
        "message" => "Error al ejecutar consulta: " . $stmt->error
    ];
    echo json_encode($response);
    exit();
}

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $pokemon = $result->fetch_assoc();
    $response = [
        "status" => "success",
        "data" => $pokemon
    ];
} else {
    http_response_code(404);
    $response = [
        "status" => "error",
        "message" => "Pokémon no encontrado"
    ];
}

$stmt->close();
$conn->close();

echo json_encode($response);
exit();
?>