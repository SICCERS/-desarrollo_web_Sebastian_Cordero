const formulario = document.getElementById("registro-miembro");
const inputNombres = document.getElementById("nombres");
const inputApellidos = document.getElementById("apellidos");
const inputTipoDocumento = document.getElementById("tipo-documento");
const inputDocumento = document.getElementById("documento");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputFechaNacimiento = document.getElementById("fecha-nacimiento");
const inputTipoMiembro = document.getElementById("tipo-miembro");

const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;  // evitamos utilizar otros caracteres que no sean letras, espcios o acentuacion 
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // establece una estructura par un correo, usario+@+texto sin espacios+ "." + texto sin espacios

const errorTipoDocumento = document.getElementById("error-tipo-documento");
const errorDocumentoVacio = document.getElementById("error-documento-vacio");
const errorDocumentoMin = document.getElementById("error-documento-min");
const errorDocumentoMax = document.getElementById("error-documento-max");

const errorCorreo = document.getElementById("error-correo");

const errorTipoMiembro = document.getElementById("error-tipo-miembro");

const errorNombresVacio = document.getElementById("error-nombres-vacio");
const errorNombresMin = document.getElementById("error-nombres-min");
const errorNombresMax = document.getElementById("error-nombres-max");
const errorNombresFormato = document.getElementById("error-nombres-formato");


const errorApellidosVacio = document.getElementById("error-apellidos-vacio");
const errorApellidosMin = document.getElementById("error-apellidos-min");
const errorApellidosMax = document.getElementById("error-apellidos-max");
const errorApellidosFormato = document.getElementById("error-apellidos-formato");

const errorTelefonoFormato = document.getElementById("error-telefono-formato");

const errorFecha = document.getElementById("error-fecha");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // buscamos  que la página no se recargue al apretar el boton de enviar 
// rescata los valores de las referencias guardadas y quitamos espacios iniciales y finales de los input 
  const nombres = inputNombres.value.trim();
  const apellidos = inputApellidos.value.trim();
  const tipoDocumento = inputTipoDocumento.value;
  const documento = inputDocumento.value.trim();
  const correo = inputCorreo.value.trim();
  const telefono = inputTelefono.value.trim();
  const fechaNacimiento = inputFechaNacimiento.value;
  const tipoMiembro = inputTipoMiembro.value;
  let valido = true;

errorNombresVacio.classList.remove("visible");
errorNombresMin.classList.remove("visible");
errorNombresMax.classList.remove("visible");
errorNombresFormato.classList.remove("visible");

// detecta si esta vacío
if (nombres === "") {
  errorNombresVacio.classList.add("visible");
  valido = false;

} else { // en caso de que pase el primer filtro de que no sea vacio comienza el resto de validaciones

  // largo minimo del nombre 
  if (nombres.length < 3) {
    errorNombresMin.classList.add("visible");
    valido = false;
  }

  // establece un largo maximo para el nombre 
  if (nombres.length > 50) {
    errorNombresMax.classList.add("visible");
    valido = false;
  }

  // detecta si se usaron caracteres como guiones, puntuacoines u otros que no sea letras, acentos o espacios 
  if (!soloLetras.test(nombres)) {
    errorNombresFormato.classList.add("visible");
    valido = false;
  }
}

  // se limpia los errores, en caso de que en una anterior ocacion se halla asignado error en alguno de estas variables, estructura de validacion similar a nombres 
errorApellidosVacio.classList.remove("visible");
errorApellidosMin.classList.remove("visible");
errorApellidosMax.classList.remove("visible");
errorApellidosFormato.classList.remove("visible");

if (apellidos === "") {
  errorApellidosVacio.classList.add("visible");
  valido = false;

} else {

  if (apellidos.length < 3) {
    errorApellidosMin.classList.add("visible");
    valido = false;
  }

  if (apellidos.length > 50) {
    errorApellidosMax.classList.add("visible");
    valido = false;
  }

  if (!soloLetras.test(apellidos)) {
    errorApellidosFormato.classList.add("visible");
    valido = false;
  }
}

// dado que que estos parametros son de seleccion solo necesitamos chequear que no esten vacios
errorTipoMiembro.classList.remove("visible")
if (tipoMiembro=== "") {errorTipoMiembro.classList.add("visible")
   valido= false
}

errorTipoDocumento.classList.remove("visible")
if (tipoDocumento=== ""){errorTipoDocumento.classList.add("visible");
  valido= false ;
}

errorDocumentoVacio.classList.remove("visible");
errorDocumentoMin.classList.remove("visible");
errorDocumentoMax.classList.remove("visible");

if (documento === "") { // tomamos un primer filtro de que no este vacio y establecemos un tamaño estandar sin conciderar guiones y puntos
  errorDocumentoVacio.classList.add("visible");
  valido = false;

} else {

  if (documento.length < 8) {
    errorDocumentoMin.classList.add("visible");
    valido = false;
  }

  if (documento.length > 9) {
    errorDocumentoMax.classList.add("visible");
    valido = false;
  }
  if (!/^\d+$/.test(documento)) {
  valido = false;
  }

}

errorCorreo.classList.remove("visible");

if (correo === "") {
  errorCorreo.classList.add("visible");
  valido = false;
// valida que se cumpla el formato que se establecio en un princio 
} else if (!formatoCorreo.test(correo)) {
  errorCorreo.classList.add("visible");
  valido = false;
}

errorTelefonoFormato.classList.remove("visible");

if (telefono !== "") { // solo se validara si es que se  escribió algo
  if (!/^\d{9}$/.test(telefono)) {  // solo permite numeros y a lo mas 9 
    errorTelefonoFormato.classList.add("visible");
    valido = false;
  }
}

errorFecha.classList.remove("visible");
if (fechaNacimiento !== "") {
  const fechaIngresada = new Date(fechaNacimiento);
  const hoy = new Date(); //se crea  una variable de la fecha actual para luego comparar

  if (fechaIngresada > hoy) { // se valida que no sea una fecha futura
    errorFecha.classList.add("visible");
    valido = false;
  }
}

if (!valido) return;
  window.location.href = "Reporte-actividades.html";
});