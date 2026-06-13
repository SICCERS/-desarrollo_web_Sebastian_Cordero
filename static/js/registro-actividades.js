const formulario = document.getElementById("registro-actividad");

const categoriaInput  = document.getElementById("categoria");
const diaInput        = document.getElementById("dia");
const horaInicioInput = document.getElementById("hora-inicio");
const horaFinInput    = document.getElementById("hora-fin");
const descripcionInput = document.getElementById("descripcion");
const archivoInput    = document.getElementById("archivo");
const enlaceInput     = document.getElementById("enlace");

const errorCategoria  = document.getElementById("error-categoria");
const errorDias       = document.getElementById("error-dias");
const errorHorario    = document.getElementById("error-horario");
const errorDescripcion = document.getElementById("error-descripcion");
const errorArchivo    = document.getElementById("error-archivo");
const errorEnlace     = document.getElementById("error-enlace");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const categoria  = categoriaInput.value;
  const dia        = diaInput.value;
  const horaInicio = horaInicioInput.value;
  const horaFin    = horaFinInput.value;
  const descripcion = descripcionInput.value.trim();
  const archivo    = archivoInput.files;
  const enlace     = enlaceInput.value.trim();
  let valido = true;

  errorCategoria.classList.remove("visible");
  if (categoria === "") {
    errorCategoria.classList.add("visible");
    valido = false;
  }

  errorDias.classList.remove("visible");
  if (dia === "") {
    errorDias.classList.add("visible");
    valido = false;
  }

  errorHorario.classList.remove("visible");
  if (horaInicio === "" || horaFin === "" || horaInicio >= horaFin) {
    errorHorario.classList.add("visible");
    valido = false;
  }

  errorDescripcion.classList.remove("visible");
  if (descripcion.length < 20 || descripcion.length > 150) {
    errorDescripcion.classList.add("visible");
    valido = false;
  }

  errorArchivo.classList.remove("visible");
  if (archivo.length === 0) {
    errorArchivo.classList.add("visible");
    valido = false;
  } else {
    for (const file of archivo) {
      if (file.size > 5 * 1024 * 1024) {  //valida que ningun archivo sea mayor a 5 mb 
        errorArchivo.classList.add("visible");
        valido = false;
        break;}}
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