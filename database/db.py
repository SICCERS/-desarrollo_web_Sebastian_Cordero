from sqlalchemy import create_engine,Column,Integer,String,ForeignKey,DateTime,Enum,Text,func
from sqlalchemy.orm import sessionmaker,declarative_base,relationship, joinedload
from datetime import datetime

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = (f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}"f"@{DB_HOST}:{DB_PORT}/{DB_NAME}")

engine = create_engine(DATABASE_URL,echo=False,future=True)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()



class Region(Base):

    __tablename__ = 'region'
    id = Column(Integer,primary_key=True,autoincrement=True)
    nombre = Column(String(200),nullable=False)
    comunas = relationship("Comuna",back_populates="region")

class Comuna(Base):

    __tablename__ = 'comuna'
    id = Column(Integer,primary_key=True,autoincrement=True)
    nombre = Column(String(200),nullable=False)
    region_id = Column(Integer,ForeignKey('region.id'),nullable=False)
    region = relationship("Region",back_populates="comunas")
    miembros = relationship("Miembro",back_populates="comuna")


class Miembro(Base):
    __tablename__ = 'miembro'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False, unique=True)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    tipo_miembro = Column(String(20), nullable=True)
    info_extra = Column(String(100), nullable=True)
    comuna = relationship("Comuna", back_populates="miembros")
    actividades = relationship("Actividad", back_populates="miembro")


class Actividad(Base):
    __tablename__ = 'actividad'
    id = Column(Integer,primary_key=True,autoincrement=True)
    miembro_id = Column(Integer,ForeignKey('miembro.id'),nullable=False)
    dia = Column(Enum('lunes','martes','miércoles','jueves','viernes','sábado','domingo'),nullable=False)
    hora_inicio = Column(String(5),nullable=False)
    duracion = Column( String(5), nullable=False)
    tipo = Column(Enum('arte','deporte','tecnología','social','recreación','otra'),nullable=False)
    nombre = Column( String(45),nullable=False)
    descripcion = Column(Text,nullable=True)
    miembro = relationship("Miembro",back_populates="actividades")
    fotos = relationship( "Foto",back_populates="actividad")
    comentarios = relationship("Comentario",back_populates="actividad",order_by="Comentario.fecha.desc()")


class Foto(Base):
    __tablename__ = 'foto'
    id = Column(Integer,primary_key=True,autoincrement=True)
    ruta_archivo = Column(String(300),nullable=False)
    nombre_archivo = Column(String(300),nullable=False)
    actividad_id = Column(Integer,ForeignKey('actividad.id'),nullable=False)
    actividad = relationship("Actividad",back_populates="fotos")

class Comentario(Base):

    __tablename__ = 'comentario'
    id = Column(Integer,primary_key=True,autoincrement=True)
    nombre = Column(String(80),nullable=False)
    texto = Column(String(300),nullable=False)
    fecha = Column(DateTime,nullable=False)
    actividad_id = Column(Integer,ForeignKey('actividad.id'),nullable=False)
    actividad = relationship("Actividad",back_populates="comentarios")

def get_comunas():
    session = SessionLocal()
    comunas = session.query(Comuna)\
        .order_by(Comuna.nombre)\
        .all()

    session.close()
    return comunas

def create_miembro(nombre, email, telefono, comuna_id, fecha_registro, tipo_miembro, info_extra):
    session = SessionLocal()
    nuevo_miembro = Miembro(
        nombre=nombre,
        email=email,
        telefono=telefono,
        comuna_id=comuna_id,
        fecha_registro=fecha_registro,
        tipo_miembro=tipo_miembro,
        info_extra=info_extra)
    session.add(nuevo_miembro)
    session.commit()
    session.refresh(nuevo_miembro)
    session.close()
    return nuevo_miembro


def create_actividad(miembro_id,dia,hora_inicio,duracion,tipo,nombre,descripcion):
    session = SessionLocal()
    nueva_actividad = Actividad(miembro_id=miembro_id,dia=dia,hora_inicio=hora_inicio,
        duracion=duracion,tipo=tipo,nombre=nombre,descripcion=descripcion)
    session.add(nueva_actividad)
    session.commit()
    session.refresh(nueva_actividad)
    session.close()
    return nueva_actividad


def create_foto(ruta_archivo,nombre_archivo,actividad_id):
    session = SessionLocal()
    nueva_foto = Foto(ruta_archivo=ruta_archivo,nombre_archivo=nombre_archivo,actividad_id=actividad_id)
    session.add(nueva_foto)
    session.commit()
    session.close()

def get_miembros():
    session = SessionLocal()
    miembros = session.query(Miembro)\
        .options(joinedload(Miembro.comuna).joinedload(Comuna.region),joinedload(Miembro.actividades).joinedload(Actividad.fotos)
        )\
        .order_by(Miembro.fecha_registro.desc())\
        .all()
    session.close()
    return miembros

def get_miembros_paginados(pagina, por_pagina, orden="fecha_registro", tipo=None):
    pagina = max(1, pagina)
    por_pagina = min(max(1, por_pagina), 100)
    session = SessionLocal()
    query = session.query(Miembro)\
        .options(
            joinedload(Miembro.comuna).joinedload(Comuna.region),
            joinedload(Miembro.actividades).joinedload(Actividad.fotos))
    if tipo:
        query = query.filter(Miembro.tipo_miembro == tipo)
    if orden == "nombre":
        query = query.order_by(Miembro.nombre)
    else:
        query = query.order_by(Miembro.fecha_registro.desc())
    conteo = session.query(Miembro)
    if tipo:
        conteo = conteo.filter(Miembro.tipo_miembro == tipo)
    total_miembros = conteo.count()
    miembros = query\
        .offset((pagina - 1) * por_pagina)\
        .limit(por_pagina)\
        .all()
    session.close()
    return miembros, total_miembros



# ── Tarea 3: Actividad por ID ──────────────────────────────────────────────

def get_actividad_por_id(actividad_id):
    """Retorna una actividad con su miembro, fotos y comentarios, o None si no existe."""
    session = SessionLocal()
    actividad = session.query(Actividad)\
        .options(
            joinedload(Actividad.miembro).joinedload(Miembro.comuna).joinedload(Comuna.region),
            joinedload(Actividad.fotos),
            joinedload(Actividad.comentarios))\
        .filter(Actividad.id == actividad_id)\
        .first()
    session.close()
    return actividad


#### cosas nuevas agregadas

def create_comentario(nombre, texto, actividad_id):
    """Inserta un comentario y retorna el objeto creado."""
    session = SessionLocal()
    nuevo = Comentario(
        nombre=nombre,
        texto=texto,
        fecha=datetime.utcnow(),
        actividad_id=actividad_id)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    session.close()
    return nuevo

def get_comentarios_por_actividad(actividad_id):
    """Retorna lista de comentarios de una actividad, del más reciente al más antiguo."""
    session = SessionLocal()
    comentarios = session.query(Comentario)\
        .filter(Comentario.actividad_id == actividad_id)\
        .order_by(Comentario.fecha.desc())\
        .all()
    session.close()
    return comentarios



def get_miembros_por_dia():
    """Gráfico 1 — miembros registrados por día (fecha sin hora)."""
    session = SessionLocal()
    resultados = session.query(
            func.date(Miembro.fecha_registro).label('dia'),
            func.count(Miembro.id).label('total'))\
        .group_by(func.date(Miembro.fecha_registro))\
        .order_by(func.date(Miembro.fecha_registro))\
        .all()
    session.close()
    return [{"dia": str(r.dia), "total": r.total} for r in resultados]

def get_actividades_por_tipo():
    """Gráfico 2 — total de actividades por tipo."""
    session = SessionLocal()
    resultados = session.query(
            Actividad.tipo.label('tipo'),
            func.count(Actividad.id).label('total'))\
        .group_by(Actividad.tipo)\
        .all()
    session.close()
    return [{"tipo": r.tipo, "total": r.total} for r in resultados]

def get_actividades_por_comuna():
    """Gráfico 3 — total de actividades por comuna (solo comunas con miembros)."""
    session = SessionLocal()
    resultados = session.query(
            Comuna.nombre.label('comuna'),
            func.count(Actividad.id).label('total'))\
        .join(Miembro, Miembro.comuna_id == Comuna.id)\
        .join(Actividad, Actividad.miembro_id == Miembro.id)\
        .group_by(Comuna.nombre)\
        .order_by(func.count(Actividad.id).desc())\
        .all()
    session.close()
    return [{"comuna": r.comuna, "total": r.total} for r in resultados]
