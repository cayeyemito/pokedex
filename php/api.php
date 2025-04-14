<?php
// Verificar que los datos se están recibiendo correctamente
if (isset($_POST['companies'])) {
    echo "Datos recibidos correctamente.\n"; // Agrega este mensaje para depurar
    $abilities = json_decode($_POST['companies'], true);
    
    if (!$abilities) {
        echo "Error al decodificar JSON: " . json_last_error_msg() . "\n";
        exit;
    }

    include 'db.php';

    // Preparar las sentencias
    // Preparar la consulta correctamente con backticks (`)
    $stmt_update = $conn->prepare("UPDATE `FormasEspeciales` SET `imagen_shiny` = ? WHERE `id` = ?");
    $stmt_update2 = $conn->prepare("UPDATE `FormasEspeciales` SET `id_pokemon_original` = ? WHERE `id` = ?");

    if (!$stmt_update || !$stmt_update2) {
        die("Error al preparar las consultas: " . $conn->error);
    }

    // Procesar cada habilidad
    foreach ($abilities as $abilitie) {
        echo "Procesando Pokémon ID: " . $abilitie['id'] . "\n";

        // Asumimos que tienes el ID en $abilitie['id']
        $stmt_update->bind_param("si", $abilitie['imagen_shiny'], $abilitie['id']);

        if ($stmt_update->execute()) {
            echo "Pokémon '{$abilitie['id']}' actualizado su imagen correctamente.\n";
        } else {
            echo "Error al actualizar Pokémon ID '{$abilitie['id']}': " . $stmt_update->error . "\n";
        }

        $stmt_update2->bind_param("ii", $abilitie['pokemon_id_original'], $abilitie['id']);

        if ($stmt_update2->execute()) {
            echo "Pokémon '{$abilitie['id']}' actualizado su id original correctamente.\n";
        } else {
            echo "Error al actualizar Pokémon ID '{$abilitie['id']}': " . $stmt_update2->error . "\n";
        }
    }

    // Cerrar la sentencia y conexión fuera del bucle
    $stmt_update->close();
    $stmt_update2->close();
    $conn->close();

    echo "Proceso completado.\n";
} else {
    echo "No se recibieron compañías.\n";
}

?>
