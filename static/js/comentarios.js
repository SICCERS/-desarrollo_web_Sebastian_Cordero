// se obtiene el id de la activida
var detalle = document.querySelector("[data-actividad-id]");

var actividadId;
if (detalle) {
  actividadId = detalle.getAttribute("data-actividad-id");
} else {
  actividadId = null;
}


function mostrarError(idElemento, mensaje) {
  var el = document.getElementById(idElemento);
  el.textContent = mensaje;
  el.classList.add("visible");}

function limpiar_error(idElemento) {
  var el = document.getElementById(idElemento);
  el.textContent = "";
  el.classList.remove("visible");}

function limpiar_todos() {
  limpiar_error("error-nombre");
  limpiar_error("error-texto");}

function bloque_comentario(comentario) {
  var div = document.createElement("div");
  div.className = "comentario-item";
  var meta = document.createElement("p");
  meta.className = "comentario-meta";
  meta.innerHTML = comentario.fecha + " — <strong>" + comentario.nombre + "</strong>";
  var texto = document.createElement("p");
  texto.className = "comentario-texto";
  texto.textContent = comentario.texto;
  div.appendChild(meta);
  div.appendChild(texto);
  return div;}


// se busca abrir los comentarios ya existentes al entrar en la pagina
function cargar_comentarios() {
  if (!actividadId) { return; }
  var estado_com = document.getElementById("estado-comentarios");
  var lista_com  = document.getElementById("lista-comentarios");
  fetch("/actividad/" + actividadId + "/comentarios")
    .then(function(res) {
      if (!res.ok) { throw new Error("Error al cargar comentarios."); }
      return res.json();
    })
    .then(function(comentarios) {
      estado_com.style.display = "none";
      lista_com.innerHTML = "";

      if (comentarios.length === 0) {
        var p = document.createElement("p");
        p.className = "sin-comentarios";
        p.textContent = "Esta actividad aún no tiene comentarios. ¡Sé el primero!";
        lista_com.appendChild(p);
        return;
      }
      comentarios.forEach(function(c) {
        lista_com.appendChild(bloque_comentario(c));
      });
    })
    .catch(function(err) {
      estado_com.textContent = "No se pudieron cargar los comentarios: " + err.message;
      estado_com.className = "grafico-error";}
    );
}



// validacion pedida en el enunciado
function validar_formulario(nombre, texto) {
  var valido = true;
  if (nombre.length < 3 || nombre.length > 80) {
    mostrarError("error-nombre", "El nombre debe tener entre 3 y 80 caracteres.");
    valido = false;}
  if (texto.length < 5 || texto.length > 300) {
    mostrarError("error-texto", "El comentario debe tener entre 5 y 300 caracteres.");
    valido = false;}
  return valido;
}



function enviar_comentario() {
  if (!actividadId) { return; }
  var nombreEl  = document.getElementById("comentario-nombre");
  var textoEl   = document.getElementById("comentario-texto");
  var exitoEl   = document.getElementById("comentario-exito");
  var listaEl   = document.getElementById("lista-comentarios");
  var sinComentariosEl = listaEl.querySelector(".sin-comentarios");
  var nombre = nombreEl.value.trim();
  var texto  = textoEl.value.trim();

  // Limpiar estado anterior
  limpiar_todos();
  exitoEl.textContent = "";
  if (!validar_formulario(nombre, texto)) { return; }
  fetch("/actividad/" + actividadId + "/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: nombre, texto: texto })
  })
    .then(function(res) {
      return res.json().then(function(datos) {
        return { status: res.status, datos: datos };
      });
    })
    .then(function(respuesta) {
      if (respuesta.status === 400) {
        // errores 
        var errores = respuesta.datos.errores || {};
        if (errores.nombre) { mostrarError("error-nombre", errores.nombre); }
        if (errores.texto)  { mostrarError("error-texto",  errores.texto);  }
        return;}
      if (respuesta.status === 201) {    // se guarda el comentario y se pone al inicio de la lista
        var nuevaTarjeta = bloque_comentario(respuesta.datos);
        if (sinComentariosEl) {  // cuando se agregar el primer comentario se elimina el mensaje de sin comentarios
          sinComentariosEl.remove();
        }
        // inserta al inicio el comentario 
        listaEl.insertBefore(nuevaTarjeta, listaEl.firstChild);
        // limpiar formulario y mensaje de éxito
        nombreEl.value = "";
        textoEl.value  = "";
        exitoEl.textContent = "Comentario agregado";
        // ocultar mensaje de éxito después de 3 segundos
        setTimeout(function() { exitoEl.textContent = ""; }, 3000);
      }}) .catch(function(err) { mostrarError("error-texto", "Error al enviar el comentario: " + err.message); });
  }


document.addEventListener("DOMContentLoaded", function() {
  cargar_comentarios();
  var btn = document.getElementById("btn-comentario");
  if (btn) {btn.addEventListener("click", enviar_comentario);}
});
