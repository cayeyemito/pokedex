<?php
if (isset($_POST['companies'])) {
    $abilities = json_decode($_POST['companies'], true);

    include 'db.php';

    $stmt_insert = $conn->prepare("INSERT INTO Habilidades (id, nombre, descripcion) VALUES (?, ?, ?)");
    $stmt_insert2 = $conn->prepare("INSERT INTO Habilidades_Pokemon (id_pokemon, id_habilidad, oculta) VALUES (?, ?, ?)");

    foreach ($abilities as $abilitie) {

        echo "Habilidad: {$abilitie['nombre']} - Pokémon: " . count($abilitie['pokemons']) . "\n";
        
        foreach ($abilitie['pokemons'] as $poke) {
            echo "Insertando Pokémon con ID: {$poke['id']} - Oculta: {$poke['is_hidden']}\n";
        }

        $stmt_insert->bind_param(
            "iss",
            $abilitie['id'],
            $abilitie['nombre'],
            $abilitie['descripcion']
        );

        if ($stmt_insert->execute()) {
            echo "Habilidad '{$abilitie['nombre']}' insertada correctamente.\n";
        } else {
            echo "Error al insertar habilidad '{$abilitie['nombre']}': " . $stmt_insert->error . "\n";
        }

        if (!isset($abilitie['pokemons']) || !is_array($abilitie['pokemons'])) continue;

        foreach ($abilitie['pokemons'] as $poke) {
            $stmt_insert2->bind_param(
                "iis",
                $poke['id'],
                $abilitie['id'],
                $poke['is_hidden']
            );

            if (!$stmt_insert2->execute()) {
                echo "Error al insertar Pokémon con ID {$poke['id']} para habilidad {$abilitie['id']}: " . $stmt_insert2->error . "\n";
            }
        }
        echo "Habilidad: {$abilitie['nombre']} - Pokémon: " . count($abilitie['pokemons']) . "\n";
    }

    $stmt_insert->close();
    $stmt_insert2->close();
    $conn->close();

    echo "Proceso completado.\n";
} else {
    echo "No se recibieron compañías.";
}
?>
