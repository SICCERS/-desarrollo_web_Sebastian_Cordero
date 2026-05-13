const formulario = document.getElementById("registro-actividad");

const categoriaInput = document.getElementById("categoria");
const horaInicioInput = document.getElementById("hora-inicio");
const horaFinInput = document.getElementById("hora-fin");
const descripcionInput = document.getElementById("descripcion");
const archivoInput = document.getElementById("archivo");
const enlaceInput = document.getElementById("enlace");

const errorCategoria = document.getElementById("error-categoria");
const errorDias = document.getElementById("error-dias");
const errorHorario = document.getElementById("error-horario");
const errorDescripcion = document.getElementById("error-descripcion");
const errorArchivo = document.getElementById("error-archivo");
const errorEnlace = document.getElementById("error-enlace");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const categoria = categoriaInput.value;
  const dias = document.querySelectorAll('input[name="dias"]:checked');
  const horaInicio = horaInicioInput.value;
  const horaFin = horaFinInput.value;
  const descripcion = descripcionInput.value.trim();
  const archivo = archivoInput.files;
  const enlace = enlaceInput.value;
  let valido = true;



errorCategoria.classList.remove("visible");
if (categoria === "") {
  errorCategoria.classList.add("visible");
  valido = false;
}

// se seleccione almenos un dia de la semana 
errorDias.classList.remove("visible");
if (dia === "") {
  errorDias.classList.add("visible");
  valido = false;
}

// se busca que se ingrese un horario  y que tenga concordancia 
errorHorario.classList.remove("visible");
if (horaInicio === "" || horaFin === "" || horaInicio >= horaFin) {
  errorHorario.classList.add("visible");
  valido = false;
}

errorDescripcion.classList.remove("visible"); // estlece un largo estandar para la descripcion
if (descripcion.length < 20 || descripcion.length > 150) {
  errorDescripcion.classList.add("visible");
  valido = false;
}

//en las siguientes validaciones buscamos que se ingrese almenos un elemento y el enlace sea valido 
errorArchivo.classList.remove("visible");
if (archivo.length === 0) {
  errorArchivo.classList.add("visible");
  valido = false;
}

errorEnlace.classList.remove("visible");
try {
  new URL(enlace);
} catch {
  errorEnlace.classList.add("visible");
  valido = false;
}

if (!valido) {
  return;
}
formulario.submit();
});