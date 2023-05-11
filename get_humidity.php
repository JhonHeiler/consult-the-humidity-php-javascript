<?php
function consultarHumedad($ciudad) {
  $claveAPI ='c141c0b561c5e511927a164181132fd3';
  $url = "https://api.openweathermap.org/data/2.5/weather?q=$ciudad&appid=$claveAPI";
  $respuesta = file_get_contents($url);
  $datos = json_decode($respuesta, true);

  if ($datos && isset($datos['main']['humidity'])) {
    return $datos['main']['humidity'];
  }

  return null;
}

$ciudad = $_GET['ciudad'];

$humedad = consultarHumedad($ciudad);

if ($humedad !== null) {
  $fecha = date('Y-m-d H:i:s');
  $historial = fopen('historial.txt', 'a');
  fwrite($historial, "$ciudad,$humedad,$fecha\n");
  fclose($historial);
}

echo json_encode(['humedad' => $humedad]);
?>
