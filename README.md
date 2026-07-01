Tarea 4 

En esta iteracion se agrega dos funcionalidades nuevas a la aplicación, usando Spring Boot en el backend y JavaScript en el frontend, sin que la página se recargue en ningún momento.

La primera funcionalidad es un buscador de actividades. El usuario escribe en un campo de texto y apenas escribe 3 caracteres o más, se busca automáticamente entre las actividades por nombre, descripción o comuna, mostrando los resultados y destacando el texto que coincide con la búsqueda.

La segunda funcionalidad es la evaluación de actividades. Cada resultado de la búsqueda muestra su nota promedio. El usuario puede elegir una nota del 1 al 7 y guardarla, y al guardar, se actualiza al instante el promedio y el contador de evaluaciones en pantalla, sin recargar la página.

En el archivo application.properties se configuró spring.jpa.hibernate.ddl-auto=none, lo que le indica a Spring Boot que no debe crear, modificar ni borrar tablas. La base de datos tarea2 ya contenía datos de tareas anteriores, como miembros y actividades, así que se prefirió evitar cualquier riesgo de que Spring Boot alterara esa información al arrancar. Por esta razón, la única tabla extra es la llamada notas, se creó manualmente con el script tabla-nota.sql antes de correr la aplicación por primera vez.

Para que la página nunca se recargue, todo el tema  dinámico se hace con JavaScript usando fetch. Por lo tanto cuando el usuario escribe en el buscador, el archivo buscador.js le pide los resultados al backend a través de la ruta /api/buscar y los muestra en pantalla. Cuando el usuario guarda una nota, buscador.js envía esa nota al backend a través de la ruta /api/actividad/{id}/nota, y el backend responde con el nuevo promedio y contador, que se actualizan en la pantalla sin recargar nada. El backend además valida que la nota sea un número entero entre 1 y 7 antes de guardarla.
