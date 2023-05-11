
function mostrarMapa(ciudad, humedad) {
  var map = L.map('map').setView([25.7617, -80.1918], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(map);

  var marker = L.marker([ciudad.lat, ciudad.lon]).addTo(map);
  marker.bindPopup(`Humedad: ${humedad}%`).openPopup();
}


function mostrarHistorial(historial) {
  var historialElemento = document.getElementById('historial');
  historialElemento.innerHTML = '';

  historial.forEach(consulta => {
    var item = document.createElement('li');
    item.textContent = `${consulta.ciudad}: ${consulta.humedad}% (${consulta.fecha})`;
    historialElemento.appendChild(item);
  });
}


async function obtenerHumedad(ciudad) {
  try {
    var url = `get_humidity.php?ciudad=${ciudad}`;
    var response = await fetch(url);
    var data = await response.json();

    if (data.humedad !== null) {
      mostrarMapa(ciudad, data.humedad);
      cargarHistorial();
    } else {
      alert('No se pudo obtener la humedad de la ciudad.');
    }
  } catch (error) {
    console.error('Error:', error);
    cargarHistorial()
  }
}


async function cargarHistorial() {
  try {
    var response = await fetch('historial.txt');
    var data = await response.text();

    var historial = data
      .split('\n')
      .filter(linea => linea.trim() !== '')
      .map(linea => {
        var [ciudad, humedad, fecha] = linea.split(',');
        return { ciudad, humedad, fecha };
      });

    mostrarHistorial(historial);
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al cargar el historial.');
  }
}

document.getElementById('consulta-btn').addEventListener('click', function() {
  var ciudadSeleccionada = document.getElementById('ciudad-select').value;
  obtenerHumedad(ciudadSeleccionada);
});

cargarHistorial();
