<?php
$host = "localhost";
$user = "ash_ketchum";
$password = "4Zf81k@g0";
$database = "Pokedex";

$conn = new mysqli($host, $user, $password, $database);

if($conn->connect_error){
    die("Error de conexión: " . $conn->connect_error);
}
?>