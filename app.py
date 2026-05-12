from flask import Flask,request,render_template,redirect,url_for,session
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
        nuevo_miembro = db.create_miembro(
            nombre=nombre_completo,
            email=correo,
            telefono=telefono,
            comuna_id=comuna_id,
            fecha_registro=datetime.now())
        session["miembro_id"] = nuevo_miembro.id
        return redirect(url_for("registro_actividades"))
    comunas = db.get_comunas()
    return render_template("Registro.html",comunas=comunas)


@app.route(
    "/registro-actividades",
    methods=["GET", "POST"])

def registro_actividades():
    if request.method == "POST":
        categoria = request.form.get("categoria")
        dia = request.form.get("dia")
        hora_inicio = request.form.get("hora-inicio")
        hora_fin = request.form.get("hora-fin")
        descripcion = request.form.get("descripcion")
        archivo = request.files.get("archivo")
        miembro_id = session.get("miembro_id")
        duracion = calcular_duracion(hora_inicio,hora_fin)
        ruta_archivo, nombre_archivo = guardar_archivo(archivo)

        nueva_actividad = db.create_actividad(
            miembro_id=miembro_id,
            dia=dia,
            hora_inicio=hora_inicio,
            duracion=duracion,
            tipo=categoria,
            nombre=f"Actividad {categoria}",
            descripcion=descripcion)
        
        if nombre_archivo is not None:
            db.create_foto(ruta_archivo=ruta_archivo,nombre_archivo=nombre_archivo,actividad_id=nueva_actividad.id)
        return redirect(url_for("lista_miembros"))
    return render_template("Reporte-actividades.html")

@app.route("/lista-miembros")
def lista_miembros():
    miembros = db.get_miembros()
    return render_template("Lista-miembros.html",miembros=miembros)

@app.route("/estadisticas")
def estadisticas():
    return render_template( "Estadisticas.html")

if __name__ == "__main__":
    app.run(debug=True)