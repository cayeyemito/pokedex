<?php
include 'db.php';

header('Content-Type: application/json');
error_reporting(0); // Desactivar errores en producción

// Limpiar buffer de salida completamente
while (ob_get_level()) ob_end_clean();

// Obtener número válido
if(isset($_REQUEST["numero"])){

    $response = [];
    $numero = null;

    $numero = filter_var($_REQUEST["numero"], FILTER_VALIDATE_INT, [
        'options' => [
            'min_range' => 1,
            'max_range' => 1025 // Ajustar según tu rango de Pokémon
        ]
    ]);

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

    $stmt = $conn->prepare("CALL ObtenerInfoCompletaPokemon('pokemon', ?, NULL);");
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
} elseif (isset($_REQUEST["tipo"])) {
    $tipo = $_REQUEST["tipo"];

    if ($conn->connect_error) {
        http_response_code(500);
        $response = [
            "status" => "error",
            "message" => "Error de conexión a la base de datos"
        ];
        echo json_encode($response);
        exit();
    }

    $tipoLike = "%" . $tipo . "%"; // Para usar con LIKE

    $stmt = $conn->prepare("CALL FiltrarPokemonPorCriterio('tipo', 0, 0, ?);");
    if (!$stmt) {
        http_response_code(500);
        $response = [
            "status" => "error",
            "message" => "Error en preparación de consulta: " . $conn->error
        ];
        echo json_encode($response);
        exit();
    }

    $stmt->bind_param("s", $tipoLike);
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

    $pokemons = [];
    while ($row = $result->fetch_assoc()) {
        $pokemons[] = $row;
    }

    if (count($pokemons) > 0) {
        $response = [
            "status" => "success",
            "data" => $pokemons
        ];
    } else {
        http_response_code(404);
        $response = [
            "status" => "error",
            "message" => "No se encontraron Pokémon con ese tipo"
        ];
    }

    $stmt->close();
    $conn->close();
} elseif (isset($_REQUEST["generacion"])) {
    $generacion = $_REQUEST["generacion"]; // Valor recibido

    if ($conn->connect_error) {
        http_response_code(500);
        $response = [
            "status" => "error",
            "message" => "Error de conexión a la base de datos"
        ];
        echo json_encode($response);
        exit();
    }

    $generacionLike = "%" . $generacion . "%"; // Para usar con LIKE

    $stmt = $conn->prepare("CALL FiltrarPokemonPorCriterio('generacion', 0, 0, ?);");
    if (!$stmt) {
        http_response_code(500);
        $response = [
            "status" => "error",
            "message" => "Error en preparación de consulta: " . $conn->error
        ];
        echo json_encode($response);
        exit();
    }

    $stmt->bind_param("s", $generacionLike);
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

    $pokemons = [];
    while ($row = $result->fetch_assoc()) {
        $pokemons[] = $row;
    }

    if (count($pokemons) > 0) {
        $response = [
            "status" => "success",
            "data" => $pokemons
        ];
    } else {
        http_response_code(404);
        $response = [
            "status" => "error",
            "message" => "No se encontraron Pokémon de esa generación"
        ];
    }

    $stmt->close();
    $conn->close();
} elseif (isset($_REQUEST["altura_min"]) || isset($_REQUEST["peso_min"])) {

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error de conexión a la base de datos"
        ]);
        exit();
    }

    // Obtener los valores de los filtros
    $alturaMin = $_REQUEST["altura_min"] ?? null;
    $alturaMax = $_REQUEST["altura_max"] ?? null;
    $pesoMin = $_REQUEST["peso_min"] ?? null;
    $pesoMax = $_REQUEST["peso_max"] ?? null;

    // Determinar qué tipo de filtro aplicar
    if ($alturaMin !== null && $alturaMax !== null && $pesoMin === null && $pesoMax === null) {
        // Solo filtro por altura
        $stmt = $conn->prepare("CALL FiltrarPokemonPorCriterio('altura', ?, ?, '');");
        $stmt->bind_param("dd", $alturaMin, $alturaMax);
    } elseif ($pesoMin !== null && $pesoMax !== null && $alturaMin === null && $alturaMax === null) {
        // Solo filtro por peso
        $stmt = $conn->prepare("CALL FiltrarPokemonPorCriterio('peso', ?, ?, '');");
        $stmt->bind_param("dd", $pesoMin, $pesoMax);
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Parámetros insuficientes para aplicar el filtro"
        ]);
        exit();
    }

    // Ejecutar consulta y obtener resultados
    if (!$stmt || !$stmt->execute()) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error en consulta: " . ($stmt ? $stmt->error : $conn->error)
        ]);
        exit();
    }

    $result = $stmt->get_result();
    $pokemons = [];

    while ($row = $result->fetch_assoc()) {
        $pokemons[] = $row;
    }

    // Verificar si se encontraron resultados y devolver la respuesta
    if (count($pokemons) > 0) {
        echo json_encode([
            "status" => "success",
            "data" => $pokemons
        ]);
        exit; // <---- MUY IMPORTANTE
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "No se encontraron Pokémon con esos filtros"
        ]);
        exit; // <---- MUY IMPORTANTE
    }

    // Cerrar la consulta y la conexión
    $stmt->close();
    $conn->close();
} else {
    http_response_code(400);
    $response = [
        "status" => "error",
        "message" => "Falta parámetro 'numero' o 'tipo'"
    ];

}

echo json_encode($response);
exit();
?>