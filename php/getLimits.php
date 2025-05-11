<?php
// Suponiendo que $conn es tu conexión mysqli ya abierta:
include 'db.php';
// 1) Prepara y ejecuta el CALL
$stmt = $conn->prepare("CALL getPokemonLimits()");
if (!$stmt) {
    // Manejo de error
    http_response_code(500);
    echo json_encode([
      "status"  => "error",
      "message" => "Error al preparar CALL: " . $conn->error
    ]);
    exit;
}

if (!$stmt->execute()) {
    // Manejo de error
    http_response_code(500);
    echo json_encode([
      "status"  => "error",
      "message" => "Error al ejecutar CALL: " . $stmt->error
    ]);
    exit;
}

// 2) Obtén el resultado (única fila con peso_min, peso_max, altura_min, altura_max)
$result = $stmt->get_result();
$limits = $result->fetch_assoc();

// 3) Devuélvelo como JSON (o úsalo directamente en tu JS)
header('Content-Type: application/json');
echo json_encode([
  "status"      => "success",
  "peso_min"    => (float)$limits['peso_min'],
  "peso_max"    => (float)$limits['peso_max'],
  "altura_min"  => (float)$limits['altura_min'],
  "altura_max"  => (float)$limits['altura_max']
]);

// 4) Limpieza
$stmt->close();
$conn->close();
?>