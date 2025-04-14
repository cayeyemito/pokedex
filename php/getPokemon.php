<?php
include 'db.php';

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = [];

// Verifica que se reciba el número por POST o GET
$numero = null;

if (isset($_POST["numero"])) {
    $numero = intval($_POST["numero"]);
} elseif (isset($_GET["numero"])) {
    $numero = intval($_GET["numero"]);
}

if ($numero !== null) {
    if ($conn->connect_error) {
        die(json_encode([
            "status" => "error",
            "message" => "Conexión fallida: " . $conn->connect_error
        ]));
    }

    // Prepara la consulta a la vista
    $stmt = $conn->prepare("SELECT * FROM pokemon_all_info HAVING numero_pokedex = ?");
    $stmt->bind_param("i", $numero);
    $stmt->execute();
    $result = $stmt->get_result();

    // Obtiene los resultados
    if ($result->num_rows > 0) {
        $pokemon = $result->fetch_assoc();
        $response = [
            "status" => "success",
            "data" => $pokemon
        ];
    } else {
        $response = [
            "status" => "error",
            "message" => "No se encontró ningún Pokémon con ese número."
        ];
    }

    $stmt->close();
    $conn->close();
} else {
    $response = [
        "status" => "error",
        "message" => "Falta el parámetro 'numero'."
    ];
}

echo json_encode($response);
exit();
