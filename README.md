En esta entrega  se toma  Tarea 2 y le agrega una vista de detalle para cada actividad con su propio sistema de comentarios, y una sección de estadísticas con gráficos que se generan en tiempo real a partir de los datos de la base. Se mantiene la misma arquitectura de antes, con Flask en el backend, SQLAlchemy para hablar con MySQL, y plantillas Jinja2 para el html.

## Vista de detalle de actividad
Se  agregó una página propia para cada actividad que se accede desde la ruta `/actividad/<id>`. Ahí se muestra toda la información de esa actividad  con los datos del individuo  que la registró, sus fotos/pdfs adjuntos y los comentarios que la gente haya dejado. Para rescatar toda esa informacion de la base, se usó `joinedload()`, que junta la información del miembro, las fotos y los comentarios en una sola consulta.

## Comentarios

Se creó una tabla `comentario` que guarda el nombre de quien comenta, el texto, la fecha y a qué actividad pertenece. Cada actividad puede tener muchos comentarios, así que la relación es de uno a muchos.

Para que todo funcione sin recargar la página, se usaron dos rutas que hablan en JSON. Una es para traer los comentarios existentes apenas se abre la página de detalle, y la otra es para guardar un comentario nuevo cuando alguien llena el formulario y hace clic en el botón. Antes de gurdar se hacen las validaciones dichas en el enciado. Si algo no cumple, se devuelve un mensaje de error en JSON y el formulario sigue ahí para que la persona pueda corregir y si esta correcto la lista de comentario cambia sin actualizar la pagina.

## Estadística

Se agregaron tres rutas nuevas que devuelven datos en JSON. El navegador pide estos datos con `fetch()` y luego los dibuja los graficos con Flot.

## Cambis en la base 

La única tabla nueva es `comentario`, con los campos id, nombre, texto, fecha y actividad_id. ESta tabla se conecta con la tabla de actividades la ultima entidad que se mencion. Ademas en la iteracion del tarea anterior, no se mencion pero se habian agregado dos nuevas filas en la tabla de la base original par guardar el tipo de persona e info extra, para guardar datos segun el tipo de miembro que se registro.

Se tiene concideracion que se usaron los mismo archivos sql que en la tarea anterior, y por temas de facilidad no se cambio ningun nombre de los archivos originales, por eso se manteiene el nombre `tarea2.sql`

## Como funciona todo en conjunto

El flujo de registro de miembros y actividades sigue funcionando igual que en la Tarea 2,  la persona se registra, queda guardada temporalmente en la sesión, completa los datos de su actividad, y al terminar se la redirige al listado de miembros.

Lo que cambio es que cuando alguien entra al detalle de una actividad. Ahí el navegador pide los comentarios existentes con AJAX y los muestra en pantalla. Si la persona escribe un comentario nuevo y lo envía, se hace otra petición al servidor, que valida los datos, los guarda en la base y responde con el comentario recién creado para que se muestre en la lista.

## Conslusion 

Se siguió usando SQLAlchemy como ORM para todas las consultas. Los comentarios y las estadísticas funcionan completamente con AJAX, sin necesidad de recargar ninguna página. Para los gráficos se usó la librería Flot, cargada desde CDN y en general se mantuvo toda la estructura. 