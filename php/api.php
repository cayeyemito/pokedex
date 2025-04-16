<?php
// Verificar que los datos se están recibiendo correctamente
if (isset($_POST['companies'])) {
    echo "Datos recibidos correctamente.\n"; // Mensaje para depuración
    $abilities = json_decode($_POST['companies'], true);

    if (!$abilities) {
        echo "Error al decodificar JSON: " . json_last_error_msg() . "\n";
        exit;
    }

    include 'db.php';

    // Preparar la sentencia UPDATE
    $stmt_update = $conn->prepare("UPDATE `FormasEspeciales` SET genero = ? WHERE id = ?");

    if (!$stmt_update) {
        echo "Error al preparar la consulta: " . $conn->error . "\n";
        exit;
    }

    // Procesar cada Pokémon
    foreach ($abilities as $abilitie) {
        echo "Procesando Pokémon: " . $abilitie['id'] . "\n";

        // Bind de parámetros (asumimos que genero es string y id es int)
        $stmt_update->bind_param("ii", $abilitie['genero'], $abilitie['id']);

        if ($stmt_update->execute()) {
            echo "Pokémon '{$abilitie['id']}' actualizado correctamente.\n";
        } else {
            echo "Error al actualizar Pokémon '{$abilitie['id']}': " . $stmt_update->error . "\n";
        }
    }

    // Cerrar sentencia y conexión
    $stmt_update->close();
    $conn->close();

    echo "Proceso completado.\n";
} else {
    echo "No se recibieron compañías.\n";
}
?>
