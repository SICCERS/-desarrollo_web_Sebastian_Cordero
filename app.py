from flask import Flask,request,render_template,redirect,url_for,session,jsonify
from datetime import datetime
from database import db
from utils import guardar_archivo,calcular_duracion


app = Flask(__name__)
app.secret_key = "clave-secreta"

@app.route("/")
def inicio():

    return render_template("Inicio.html")

@app.route("/registro", methods=["GET", "POST"])
def registro():
    if request.method == "POST":
        nombres = request.form.get("nombres")
        apellidos = request.form.get("apellidos")
        nombre_completo = f"{nombres} {apellidos}"
        correo = request.form.get("correo")
        telefono = request.form.get("telefono")
        comuna_id = request.form.get("comuna_id")
        tipo_miembro = request.form.get("tipo-miembro")
        info_extra = request.form.get("info-extra")
        nuevo_miembro = db.create_miembro(
            nombre=nombre_completo,
            email=correo,
            telefono=telefono,
            comuna_id=comuna_id,
            fecha_registro=datetime.now(),
            tipo_miembro=tipo_miembro,
            info_extra=info_extra)
        session["miembro_id"] = nuevo_miembro.id
        return redirect(url_for("registro_actividades"))
    comunas = db.get_comunas()
    return render_template("Registro.html",comunas=comunas)


@app.route("/registro-actividades", methods=["GET", "POST"])
def registro_actividades():
    if request.method == "POST":
        miembro_id = session.get("miembro_id")
        if not miembro_id:
            return redirect(url_for("registro"))
        categoria= request.form.get("categoria")
        dia= request.form.get("dia")
        hora_inicio= request.form.get("hora-inicio")
        hora_fin= request.form.get("hora-fin")
        descripcion= request.form.get("descripcion")
        archivos= request.files.getlist("archivo")
        if hora_fin <= hora_inicio:
            return render_template("Reporte-actividades.html",
                                   error="La hora de fin debe ser mayor a la de inicio.")
        duracion = calcular_duracion(hora_inicio, hora_fin)
        nueva_actividad = db.create_actividad(
            miembro_id=miembro_id,
            dia=dia,
            hora_inicio=hora_inicio,
            duracion=duracion,
            tipo=categoria,
            nombre=f"Actividad {categoria}",
            descripcion=descripcion)
        for archivo in archivos:
            ruta_archivo, nombre_archivo = guardar_archivo(archivo)
            if nombre_archivo is not None:
                db.create_foto(
                    ruta_archivo=ruta_archivo,
                    nombre_archivo=nombre_archivo,
                    actividad_id=nueva_actividad.id)
        session.pop("miembro_id", None)
        return redirect(url_for("lista_miembros"))

    return render_template("Reporte-actividades.html")

@app.route("/lista-miembros")
def lista_miembros():
    pagina = request.args.get("page", 1, type=int)
    orden = request.args.get("orden", "fecha_registro")
    tipo = request.args.get("tipo", None)
    miembros_por_pagina = 5
    miembros, total_miembros = db.get_miembros_paginados(pagina, miembros_por_pagina, orden, tipo)
    total_paginas = (total_miembros + miembros_por_pagina - 1) // miembros_por_pagina
    return render_template("Lista-miembros.html",miembros=miembros, pagina=pagina,total_paginas=total_paginas, orden=orden,tipo=tipo)

@app.route("/estadisticas")
def estadisticas():
    return render_template( "Estadisticas.html")

 #### ── Tarea 3: Detalle de actividad ─────────────────────────────────────────

@app.route("/actividad/<int:actividad_id>")
def detalle_actividad(actividad_id):
    actividad = db.get_actividad_por_id(actividad_id)
    if actividad is None:
        return render_template("404.html"), 404
    return render_template("Detalle-actividad.html", actividad=actividad)


# ── Tarea 3: Comentarios (async) ──────────────────────────────────────────

@app.route("/actividad/<int:actividad_id>/comentarios", methods=["GET"])
def listar_comentarios(actividad_id):
    """Retorna los comentarios de una actividad como JSON."""
    actividad = db.get_actividad_por_id(actividad_id)
    if actividad is None:
        return jsonify({"error": "Actividad no encontrada"}), 404
    comentarios = db.get_comentarios_por_actividad(actividad_id)
    datos = [{"nombre": c.nombre,
              "texto": c.texto,
              "fecha": c.fecha.strftime("%d/%m/%Y %H:%M")} for c in comentarios]
    return jsonify(datos)


@app.route("/actividad/<int:actividad_id>/comentarios", methods=["POST"])
def agregar_comentario(actividad_id):
    """Recibe un comentario vía fetch/XHR, lo valida y lo guarda."""
    actividad = db.get_actividad_por_id(actividad_id)
    if actividad is None:
        return jsonify({"error": "Actividad no encontrada"}), 404

    datos = request.get_json(silent=True) or {}
    nombre = datos.get("nombre", "").strip()
    texto  = datos.get("texto",  "").strip()

    # Validación servidor
    errores = {}
    if len(nombre) < 3 or len(nombre) > 80:
        errores["nombre"] = "El nombre debe tener entre 3 y 80 caracteres."
    if len(texto) < 5 or len(texto) > 300:
        errores["texto"] = "El comentario debe tener entre 5 y 300 caracteres."
    if errores:
        return jsonify({"errores": errores}), 400
    comentario = db.create_comentario(nombre=nombre, texto=texto, actividad_id=actividad_id)
    return jsonify({"nombre":comentario.nombre, "texto":comentario.texto,"fecha":comentario.fecha.strftime("%d/%m/%Y %H:%M")}), 201




@app.route("/api/grafico/miembros-por-dia")
def grafico_miembros_por_dia():
    return jsonify(db.get_miembros_por_dia())

@app.route("/api/grafico/actividades-por-tipo")
def grafico_actividades_por_tipo():
    return jsonify(db.get_actividades_por_tipo())

@app.route("/api/grafico/actividades-por-comuna")
def grafico_actividades_por_comuna():
    return jsonify(db.get_actividades_por_comuna())

if __name__ == "__main__":
    app.run(debug=True)