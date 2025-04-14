<?php
// Verificar que los datos se están recibiendo correctamente
if (isset($_POST['companies'])) {
    echo "Datos recibidos correctamente.\n"; // Agrega este mensaje para depurar
    $abilities = json_decode($_POST['companies'], true);
    
    if (!$abilities) {
        echo "Error al decodificar JSON: " . json_last_error_msg() . "\n"; // Verifica si hubo algún error al decodificar
    }

    include 'db.php';

    // Preparar las sentencias
    $stmt_insert = $conn->prepare("INSERT INTO `Pokemon`(`id`, `nombre`, `descripcion`, `grito`, `imagen`, `peso`, `altura`, `hp`, `ataque_f`, `ataque_e`, `defensa_f`, `defensa_e`, `velocidad`, `legendario`, `mitico`, `generacion`, `tipo`, `tipo_secundario`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt_insert2 = $conn->prepare("INSERT INTO `Movimientos_Pokemon`(`id_pokemon`, `id_movimiento`, `nivel`, `metodo_aprendizaje`) VALUES (?, ?, ?, ?)");
    $stmt_insert3 = $conn->prepare("INSERT INTO `FormasEspeciales`(`id`, `nombre`, `grito`, `imagen`, `peso`, `altura`, `hp`, `ataque-f`, `ataque-e`, `defensa-f`, `defensa-e`, `velocidad`, `tipo`, `tipo_secundario`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    // Procesar cada habilidad
    foreach ($abilities as $abilitie) {
        // Depuración para verificar que cada Pokémon se está procesando correctamente
        echo "Procesando Pokémon: " . $abilitie['nombre'] . "\n";

        // Insertar el Pokémon
        $stmt_insert->bind_param(
            "issssiiiiiiiisssss",
            $abilitie['id'],
            $abilitie['nombre'],
            $abilitie['descripcion'],
            $abilitie['grito'],
            $abilitie['imagen'],
            $abilitie['peso'],
            $abilitie['altura'],
            $abilitie['hp'],
            $abilitie['ataque_f'],
            $abilitie['ataque_e'],
            $abilitie['defensa_f'],
            $abilitie['defensa_e'],
            $abilitie['velocidad'],
            $abilitie['legendario'],
            $abilitie['mitico'],
            $abilitie['generacion'],
            $abilitie['tipo'],
            $abilitie['tipo_secundario']
        );

        if ($stmt_insert->execute()) {
            echo "Pokémon '{$abilitie['nombre']}' insertado correctamente.\n";
        } else {
            echo "Error al insertar Pokémon '{$abilitie['nombre']}': " . $stmt_insert->error . "\n";
        }

        // Insertar los movimientos del Pokémon
        if (isset($abilitie['movimientos']) && is_array($abilitie['movimientos'])) {
            foreach ($abilitie['movimientos'] as $poke) {
                $stmt_insert2->bind_param(
                    "isis",
                    $abilitie['id'],  // Asegurando que se inserte el ID del Pokémon correctamente
                    $poke['id'],      // ID del movimiento
                    $poke['nivel'],    // Nivel
                    $poke['metodo']    // Método de aprendizaje
                );

                if ($stmt_insert2->execute()) {
                    echo "Movimiento '{$poke['id']}' insertado correctamente.\n";
                } else {
                    echo "Error al insertar movimiento para Pokémon con ID {$abilitie['id']}: " . $stmt_insert2->error . "\n";
                }
            }
        }

        // Insertar las formas especiales del Pokémon
        if (isset($abilitie['especies']) && is_array($abilitie['especies'])) {
            foreach ($abilitie['especies'] as $poke) {
                $stmt_insert3->bind_param(
                    "isssiiiiiiiiss",
                    $poke['id'],
                    $poke['name'],
                    $poke['grito'],
                    $poke['imagen'],
                    $poke['peso'],
                    $poke['altura'],
                    $poke['hp'],
                    $poke['ataque_f'],
                    $poke['ataque_e'],
                    $poke['defensa_f'],
                    $poke['defensa_e'],
                    $poke['velocidad'],
                    $poke['tipo'],
                    $poke['tipo_secundario']
                );

                if ($stmt_insert3->execute()) {
                    echo "Especie '{$poke['name']}' insertada correctamente.\n";
                } else {
                    echo "Error al insertar especie '{$poke['nombre']}': " . $stmt_insert3->error . "\n";
                }
            }
        }
    }

    // Cerrar sentencias y conexión
    $stmt_insert->close();
    $stmt_insert2->close();
    $stmt_insert3->close();
    $conn->close();

    echo "Proceso completado.\n";
} else {
    echo "No se recibieron compañías.\n";
}

?>
