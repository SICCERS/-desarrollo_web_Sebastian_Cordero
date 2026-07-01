var input = document.getElementById("busqueda");
var estado = document.getElementById("estado");
var resultados = document.getElementById("resultados");

// cada vez que el usuario escribe en el input
input.addEventListener("input", function () {
  var texto = input.value.trim();

  // solo buscamos si hay 3 o más caracteres
  if (texto.length < 3) {
    resultados.innerHTML = "";
    estado.textContent = "";
    return;
  }
  buscar(texto);
});

// usando para buscador 
function buscar(texto) {
  estado.textContent = "Buscando...";
  fetch("/api/buscar?q=" + encodeURIComponent(texto))
    .then(function (res) {
      if (!res.ok) { throw new Error("Error en la búsqueda"); }
      return res.json();
    })
    .then(function (actividades) {
      mostrar(actividades, texto);
    })
    .catch(function (err) {
      estado.textContent = "No se pudo buscar: " + err.message;
    });
}

// destaca la lista de string de resultados que coinciddieron 
function mostrar(actividades, texto) {
  resultados.innerHTML = "";

  if (actividades.length === 0) {
    estado.textContent = "No se encontraron actividades.";
    return;
  }
  estado.textContent = "";

  actividades.forEach(function (a) {
    resultados.appendChild(tarjeta(a, texto));
  });
}

// evita que símbolos altere la búsqueda al resaltar
function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// envuelve el texto coincidente y lo marca 
function resaltar(texto, patron) {
  if (!texto) { return ""; }
  var patronSeguro = escaparRegex(patron);
  var regex = new RegExp("(" + patronSeguro + ")", "gi");
  return texto.replace(regex, "<mark>$1</mark>");
}

// arma una tarjeta de actividad
function tarjeta(a, texto) {
  var div = document.createElement("div");
  div.className = "tarjeta";

  var titulo = document.createElement("h3");
  titulo.innerHTML = resaltar(a.nombre, texto);
  div.appendChild(titulo);

  var datos = document.createElement("p");
  datos.className = "tarjeta-datos";
  datos.innerHTML =
    "<strong>Miembro:</strong> " + a.miembro + " · " +
    "<strong>Día:</strong> " + a.dia + " · " +
    "<strong>Tipo:</strong> " + a.tipo + " · " +
    "<strong>Comuna:</strong> " + resaltar(a.comuna, texto);
  div.appendChild(datos);

  var desc = document.createElement("p");
  desc.innerHTML = "<strong>Descripción:</strong> " + resaltar(a.descripcion, texto);
  div.appendChild(desc);

  div.appendChild(bloqueNota(a));
  return div;
}

// arma el cuadro  de la nota 
function bloqueNota(a) {
  var cont = document.createElement("div");
  cont.className = "nota-bloque";

  var info = document.createElement("span");
  info.className = "nota-info";
  info.id = "nota-info-" + a.id;
  info.textContent = textoNota(a.promedio, a.cantidad);
  cont.appendChild(info);

  var select = document.createElement("select");
  select.id = "select-" + a.id;
  var vacia = document.createElement("option");
  vacia.value = "";
  vacia.textContent = "Nota...";
  select.appendChild(vacia);
  for (var i = 1; i <= 7; i++) {
    var op = document.createElement("option");
    op.value = i;
    op.textContent = i;
    select.appendChild(op);
  }
  cont.appendChild(select);

  var boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = "Evaluar";
  boton.addEventListener("click", function () {
    evaluar(a.id);
  });
  cont.appendChild(boton);

  var msj = document.createElement("p");
  msj.className = "nota-msj";
  msj.id = "nota-msj-" + a.id;
  cont.appendChild(msj);

  return cont;
}

// texto que muestra el promedio y el contador
function textoNota(promedio, cantidad) {
  return "Nota: " + promedio + " (" + cantidad + " evaluaciones)";
}

// envía la nota seleccionada al backend (async) y recalcula en pantalla
function evaluar(id) {
  var select = document.getElementById("select-" + id);
  var msj = document.getElementById("nota-msj-" + id);
  var valor = select.value;

  msj.textContent = "";
  msj.className = "nota-msj";

  //  el cliente debe haber elegido una nota
  if (valor === "") {
    msj.textContent = "Selecciona una nota entre 1 y 7.";
    msj.className = "nota-msj error";
    return;
  }

  fetch("/api/actividad/" + id + "/nota", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nota: Number(valor) })
  })
    .then(function (res) {
      if (!res.ok) { throw new Error("nota no válida"); }
      return res.json();
    })
    .then(function (resumen) {
      var info = document.getElementById("nota-info-" + id);
      info.textContent = textoNota(resumen.promedio, resumen.cantidad);
      select.value = "";
      msj.textContent = "Nota guardada";
      msj.className = "nota-msj exito";
    })
    .catch(function (err) {
      msj.textContent = "No se pudo guardar: " + err.message;
      msj.className = "nota-msj error";
    });
}
