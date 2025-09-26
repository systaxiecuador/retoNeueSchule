<?php
/**
 *
 * @param int $casosRestantes El número de casos de prueba que faltan por procesar.
 * @param resource $stream El flujo de entrada de donde se leen los datos.
 */
function procesarCaso($casosRestantes, $stream) {
    // Caso base: si ya no hay casos por procesar, la recursión termina.
    if ($casosRestantes <= 0) {
        return;
    }

    // Leemos la línea que indica cuántos enteros vienen (X)
    fgets($stream);

    // Leemos la línea con los números, la limpiamos y la convertimos en un array.
    $lineaNumeros = trim(fgets($stream));
    $numeros = array_map('intval', explode(' ', $lineaNumeros));

    // 1. FILTRAR: Mantenemos solo los números menores o iguales a 50.
    $filtrados = array_filter(
        $numeros,
        fn($n) => $n <= 50
    );

    // 2. MAPEAR: Elevamos al cubo cada número filtrado.
    $cubos = array_map(
        fn($n) => $n ** 3,
        $filtrados
    );

    // 3. REDUCIR: Sumamos todos los cubos para obtener el resultado final.
    $resultado = array_sum($cubos);

    // Imprimimos el resultado del caso actual.
    echo 'Resultado: '.$resultado . "\n";

    // Llamada recursiva: procesamos el siguiente caso.
    procesarCaso($casosRestantes - 1, $stream);
}

// Abrimos el flujo de entrada estándar para leer los datos.
$stdin = fopen('php://stdin', 'r');

// Leemos la primera línea para saber el número total de casos (N).
$numCasos = (int) fgets($stdin);

// Iniciamos el proceso llamando a nuestra función por primera vez.
procesarCaso($numCasos, $stdin);

// Cerramos el flujo de entrada.
fclose($stdin);
