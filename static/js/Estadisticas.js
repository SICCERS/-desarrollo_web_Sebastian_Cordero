var color1 = "#002A4A";
var color2 = "#4bb4f8";
var colores_torta = [ "#17a2b8", "#4bb4f8", "#e74c3c", "#5cb85c", "#9b59b6", "#f0ad4e"];


function mostrarError(idEstado, mensaje) {
  var el = document.getElementById(idEstado);
  el.textContent = mensaje;
  el.className = "grafico-error";}

function ocultarEstado(idEstado) {
  var el = document.getElementById(idEstado);
  el.textContent = "";
  el.style.display = "none"}


//grafico de linea 
function cargar_grafico1() {
  fetch("/api/grafico/miembros-por-dia")
    .then(function(res) {
      if (!res.ok) { throw new Error("Error al obtener datos"); }
      return res.json();
    })
    .then(function(datos) {
      if (datos.length === 0) {
        mostrarError("estado-grafico1", "No hay datos de miembros registrados aún.");
        return;}
      var puntos = datos.map(function(d, i) { return [i, d.total]; });
      var etiquetas = datos.map(function(d, i) { return [i, d.dia]; });

      ocultarEstado("estado-grafico1");

      $.plot("#grafico1", [{
        data:  puntos,
        color: color2,
        lines: { show: true, lineWidth: 2, fill: false}, 
        points: { show: true, radius: 4, fillColor: color1 }
      }], {
        xaxis: {
          ticks: etiquetas,
          tickLength: 0,
          font: { size: 11, color: "#555" }
        },
        yaxis: {
          minTickSize: 1,
          tickDecimals: 0
        },
        grid: {
          borderWidth: 1,
          borderColor: "#dbdbdb",
          hoverable: true
        },
        series: {
          shadowSize: 0
        }
      });
    })
    .catch(function(err) {
      mostrarError("estado-grafico1", "No se pudieron cargar los datos: " + err.message);});
}


// grafico de torta 

function cargar_grafico2() {
  fetch("/api/grafico/actividades-por-tipo")
    .then(function(res) {
      if (!res.ok) { throw new Error("Error al obtener datos"); }
      return res.json();
    })
    .then(function(datos) {
      if (datos.length === 0) {
        mostrarError("estado-grafico2", "No hay actividades registradas aún.");
        return;}

      var series = datos.map(function(d, i) {
        return {
          label: d.tipo.charAt(0).toUpperCase() + d.tipo.slice(1),
          data:  d.total,
          color: colores_torta[i % colores_torta.length]
        };
      }); ocultarEstado("estado-grafico2");

      $.plot("#grafico2", series, {
        series: {
          pie: {
            show: true,
            radius: 0.8,
            label: {
              show: true,
              radius: 0.65,
              formatter: function(label, slice) {
                return "<div style='font-size:11px;text-align:center;color:white;'>"
                  + label + "<br>" + slice.percent.toFixed(1) + "%</div>";
              }
            }
          }
        },
        legend: {
          show: false,
          position: "nw"
        }
      });
    })
    .catch(function(err) {
      mostrarError("estado-grafico2", "No se pudieron cargar los datos: " + err.message);
    });
}


//grafico de barras

function cargar_grafico3() {
  fetch("/api/grafico/actividades-por-comuna")
    .then(function(res) {
      if (!res.ok) { throw new Error("Error al obtener datos"); }
      return res.json();
    })
    .then(function(datos) {
      if (datos.length === 0) {
        mostrarError("estado-grafico3", "No hay actividades registradas aún.");
        return;}
      var barras   = datos.map(function(d, i) { return [i, d.total]; });
      var etiquetas = datos.map(function(d, i) { return [i, d.comuna]; });

      ocultarEstado("estado-grafico3");

      $.plot("#grafico3", [{
        data:  barras,
        color: color1,
        bars: { show: true, barWidth: 0.3, align: "center", fillColor: color2 }
      }], {
        xaxis: {
          ticks: etiquetas,
          tickLength: 0,
          font: { size: 10, color: "#555" }
        },
        yaxis: {
          minTickSize: 1,
          tickDecimals: 0
        },
        grid: {
          borderWidth: 1,
          borderColor: "#dbdbdb",
          hoverable: true
        },
        series: {
          shadowSize: 0
        }
      });
    })
    .catch(function(err) {
      mostrarError("estado-grafico3", "No se pudieron cargar los datos: " + err.message);
    });
}


$(document).ready(function() {
  cargar_grafico1();
  cargar_grafico2();
  cargar_grafico3();
});
