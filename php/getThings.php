<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
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
            "message" => "Habilidad no encontrado"
        ];
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
    exit();

} else if (isset($_REQUEST["movimiento"])){
    $numero = $_REQUEST["movimiento"];

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error de conexión a la base de datos"
        ]);
        exit();
    }

    $stmt = $conn->prepare("SELECT nombre, descripcion, precision_ataque, potencia, tipo, pp, categoria FROM Movimientos WHERE id = ?");
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
            "message" => "Movimiento no encontrado"
        ];
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
    exit();
} else if (isset($_POST["evoluciones"])){

    $numeros = explode(",", $_POST["evoluciones"]);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error de conexión a la base de datos"
        ]);
        exit();
    }

    $pokemons = [];

    foreach ($numeros as $numero) {
        $stmt = $conn->prepare("CALL GetPokemonImagen(?)");
    
        if (!$stmt) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Error en preparación de consulta: " . $conn->error
            ]);
            exit();
        }
    
        $numero = (int)$numero;
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
            $pokemons[] = $pokemon;
        } else {
            $pokemons[] = [
                "status" => "error",
                "id" => $numero,
                "message" => "Pokémon no encontrado"
            ];
        }
    
        $stmt->close();
    }

    // Cerrar la conexión con la base de datos
    $conn->close();

    // Devolver los resultados como un JSON
    echo json_encode([
        "status" => "success",
        "data" => $pokemons
    ]);
    exit();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió ninguna petición válida"
    ]);
    exit();
}
?>
