<?php
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
require 'db.php';

// Que MySQL te dé un JSON puro
$query = "
  SELECT 
    JSON_UNQUOTE(
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', id,
          'name', nombre,
          'image', imagen
        )
      )
    ) AS pokes_json,
    COUNT(*) AS total_pokemons
  FROM Pokemon;
";

$result = $conn->query($query);
$row = $result->fetch_assoc();

// Si no vino nada, devolvemos un array vacío
$pokesJson = $row['pokes_json'] ?: '[]';
$total    = (int)$row['total_pokemons'];

// Inyectamos ese JSON directamente en la respuesta
echo <<<JS
{
  "success": true,
  "data": $pokesJson,
  "total_pokemons": $total
}
JS;

$conn->close();
