<?php
$host = "localhost";
$user = "cayetano";
$password = "9?mIr79a2";
$database = "Pokedex";

$conn = new mysqli($host, $user, $password, $database);

if($conn->connect_error){
    die("Error de conexión: " . $conn->connect_error);
}
?>