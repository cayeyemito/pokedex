<?php
include 'db.php';

header('Content-Type: application/json');
error_reporting(0); // Desactivar errores en producción

// Limpiar buffer de salida completamente
while (ob_get_level()) ob_end_clean();

$response = [];
$numero = null;

if (isset($_REQUEST["habilidad"])) {
    $numero = $_REQUEST["habilidad"];

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error de conexión a la base de datos"
        ]);
        exit();
    }

    $stmt = $conn->prepare("SELECT nombre, descripcion FROM Habilidades WHERE id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error en preparación de consulta: " . $conn->error
        ]);
        exit();
    }

    $stmt->bind_param("i", $numero);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error al ejecutar consulta: " . $stmt->error
        ]);
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

} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Falta el parámetro 'habilidad'"
    ]);
    exit();
}
?>
