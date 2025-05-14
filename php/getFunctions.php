<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include 'db.php'; // Donde se define $conn

if (isset($_POST['tipo1']) && isset($_POST['tipo2'])) {
    $tipo1 = $_POST['tipo1'];
    $tipo2 = $_POST['tipo2'];

    // Convertimos tipo2 en NULL si es vacío o 'null'
    $tipo2 = (empty($tipo2) || strtolower($tipo2) === 'null') ? null : $tipo2;

    // Usamos placeholders en vez de concatenar SQL
    $query = "SELECT obtener_efectividades(?, ?) AS resultado";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        echo json_encode(['error' => 'Error al preparar la consulta: ' . $conn->error]);
        exit;
    }

    // Ambos parámetros son strings, pero uno puede ser null
    $stmt->bind_param("ss", $tipo1, $tipo2);

    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Error al ejecutar la consulta: ' . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $stmt->close();
    $conn->close();

    echo json_encode($data);
} else {
    echo json_encode(['error' => 'Faltan parámetros tipo1 o tipo2']);
}
?>

