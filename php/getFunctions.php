<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include 'db.php'; // Aquí se define $conn

if (isset($_POST['tipo1']) && isset($_POST['tipo2'])) {
    $tipo1 = $conn->real_escape_string($_POST['tipo1']);
    $tipo2 = $conn->real_escape_string($_POST['tipo2']);

    // Si tipo2 está vacío o es 'null', se pasa como NULL
    $tipo2_sql = (!empty($tipo2) && strtolower($tipo2) !== 'null') ? "'$tipo2'" : 'NULL';

    $query = "SELECT obtener_efectividades('$tipo1', $tipo2_sql)";
    $result = $conn->query($query);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
        exit;
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $result->close();
    echo json_encode($data);
} else {
    echo json_encode(['error' => 'Faltan parámetros tipo1 o tipo2']);
}
?>
