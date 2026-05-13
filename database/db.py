from sqlalchemy import create_engine,Column,Integer,String,ForeignKey,DateTime,Enum,Text
from sqlalchemy.orm import sessionmaker,declarative_base,relationship, joinedload

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
    id = Column(Integer,primary_key=True,autoincrement=True)
    nombre = Column( String(255), nullable=False)
    email = Column(String(80),nullable=False,unique=True)
    telefono = Column(String(15),nullable=False)
    fecha_registro = Column(DateTime,nullable=False)
    comuna_id = Column(Integer,ForeignKey('comuna.id'),nullable=False)
    comuna = relationship("Comuna",back_populates="miembros")
    actividades = relationship("Actividad",back_populates="miembro")


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


class Foto(Base):

    __tablename__ = 'foto'
    id = Column(Integer,primary_key=True,autoincrement=True)
    ruta_archivo = Column(String(300),nullable=False)
    nombre_archivo = Column(String(300),nullable=False)
    actividad_id = Column(Integer,ForeignKey('actividad.id'),nullable=False)
    actividad = relationship("Actividad",back_populates="fotos")

def get_comunas():
    session = SessionLocal()
    comunas = session.query(Comuna)\
        .order_by(Comuna.nombre)\
        .all()

    session.close()
    return comunas

def create_miembro(nombre,email,telefono,comuna_id,fecha_registro):

    session = SessionLocal()
    nuevo_miembro = Miembro(nombre=nombre,email=email,telefono=telefono,comuna_id=comuna_id,fecha_registro=fecha_registro)
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