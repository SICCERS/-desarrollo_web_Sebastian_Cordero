from werkzeug.utils import secure_filename
from datetime import datetime

import hashlib
import filetype
import os


UPLOAD_FOLDER = "static/uploads"


def generar_nombre_archivo(nombre_original):
    nombre_seguro = secure_filename(nombre_original)
    hash_nombre = hashlib.sha256(f"{datetime.now()}-{nombre_seguro}".encode()).hexdigest()
    extension = os.path.splitext(nombre_seguro)[1]
    return f"{hash_nombre}{extension}"


def guardar_archivo(archivo):

    if not archivo or archivo.filename == "":
        return None, None
    nombre_archivo = generar_nombre_archivo(archivo.filename)
    os.makedirs(UPLOAD_FOLDER,exist_ok=True)
    ruta_archivo = os.path.join(UPLOAD_FOLDER,nombre_archivo)
    archivo.save(ruta_archivo)
    tipo_archivo = filetype.guess(ruta_archivo)
    if tipo_archivo is None:
        os.remove(ruta_archivo)
        return None, None
    tipos_permitidos = ["image/jpeg","image/png","application/pdf"]

    if tipo_archivo.mime not in tipos_permitidos:
        os.remove(ruta_archivo)
        return None, None
    return ruta_archivo, nombre_archivo

def calcular_duracion(hora_inicio,hora_fin):

    inicio = datetime.strptime(hora_inicio,"%H:%M")
    fin = datetime.strptime(hora_fin,"%H:%M")
    diferencia = fin - inicio
    total_segundos = int(diferencia.total_seconds())
    horas = total_segundos // 3600
    minutos = (total_segundos % 3600) // 60
    return f"{horas:02}:{minutos:02}"