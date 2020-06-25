﻿drop schema public cascade;
create schema public;
--CREO EL TIPO ENUMERADO QUE VAMOS A USAR
CREATE TYPE chiches AS ENUM ('Pizarra','Proyector','Pizarron','Ventilador');
CREATE TYPE situation AS ENUM ('ACTIVO','INACTIVO','BAJA');
CREATE TYPE dias AS ENUM ('lunes','martes','miercoles','jueves','viernes','sabado');
CREATE TYPE period AS ENUM ('primer cuatrimestre','segundo cuatrimestre','anual');
CREATE TYPE state AS ENUM ('AUTORIZADA','PENDIENTE','FINALIZADA','RECHAZADA');
CREATE TABLE IF NOT EXISTS usuarios(
    id SERIAL PRIMARY KEY,
    username text NOT NULL CHECK (username <> ''),
    password text NOT NULL CHECK (password <> ''),
    tipo text NOT NULL CHECK (tipo <> ''),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS edificio(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    direccion text NOT NULL CHECK (direccion <> ''),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 
DROP TABLE IF EXISTS aulas;
CREATE TABLE IF NOT EXISTS aulas(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    nombre text NOT NULL CHECK (nombre <> ''),
    numero integer NOT NULL,
    "edificioId" smallint,
    capacidad integer NOT NULL,
    ubicacion text NOT NULL CHECK (ubicacion <> ''),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("edificioId") REFERENCES edificio(id)
);
CREATE TABLE IF NOT EXISTS extras(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "aulaId" smallint REFERENCES aulas(id),
    extra chiches
);
CREATE TABLE IF NOT EXISTS facultad(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS carrera(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    "cantAnios" int NOT NULL,
    "facultadId" smallint,
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("facultadId") REFERENCES facultad(id)
);
CREATE TABLE IF NOT EXISTS docente(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    apellido text NOT NULL CHECK (apellido <> ''),
    legajo text NOT NULL CHECK (legajo <> ''),
    dni integer NOT NULL,
    "usuarioId" smallint,
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("usuarioId") REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS administrador(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    apellido text NOT NULL CHECK (apellido <> ''),
    legajo text NOT NULL CHECK (legajo <> ''),
    dni integer NOT NULL,
    "usuarioId" smallint,
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("usuarioId") REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS materia(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    periodo period,
    anio integer NOT NULL,
    cod integer UNIQUE,
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS reserva(
    id SERIAL PRIMARY KEY,
    dia dias,
    "horaInicio" integer NOT NULL,
    "horaFin" integer NOT NULL,
    estado state,
    "aulaId" smallint REFERENCES aulas(id),
    "docenteId" smallint REFERENCES docente(id),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS reservaMateria(
    "reservaId" smallint REFERENCES reserva(id),
    "materiumId" integer REFERENCES materia(cod),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("reservaId","materiumId")
);
CREATE TABLE IF NOT EXISTS carreraMateria(
    "materiumId" integer REFERENCES materia(cod),
    "carreraId" smallint REFERENCES carrera(id),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("materiumId","carreraId")
);
CREATE TABLE IF NOT EXISTS reservaAdmin(
    "reservaId" smallint REFERENCES reserva(id),
    "administradorId" integer REFERENCES administrador(id),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("reservaId","administradorId")
);
CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW."updatedAt" = now();
      RETURN NEW;
  END;
  $$ language 'plpgsql';
CREATE TRIGGER tr_edificio BEFORE UPDATE ON edificio FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_aulas BEFORE UPDATE ON aulas FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_facultad BEFORE UPDATE ON facultad FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_carrera BEFORE UPDATE ON carrera FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_docente BEFORE UPDATE ON docente FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_administrador BEFORE UPDATE ON administrador FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_reserva BEFORE UPDATE ON reserva FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_reservamateria BEFORE UPDATE ON reservamateria FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_materia BEFORE UPDATE ON materia FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_carreramateria BEFORE UPDATE ON carreramateria FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();
CREATE TRIGGER tr_reservaadmin BEFORE UPDATE ON reservaadmin FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at ();

    INSERT INTO usuarios(username,password,tipo) VALUES
    ('mSilvestri777','0000','DOCENTE'),
    ('web4kd','0000','DOCENTE'),
    ('admin1','0000', 'ADMIN'),
    ('admin2','0000', 'ADMIN'),
    ('admin3','0000', 'ADMIN'),
    ('admin4','0000', 'ADMIN');


    INSERT INTO edificio(nombre,direccion) VALUES 
    ('bloque 2','Ejercito de Los Andes 950, Ciudad de San Luis, Provincia de San Luis D5700HHW'),
    ('bloque 1','Ejercito de Los Andes 950, Ciudad de San Luis, Provincia de San Luis D5700HHW'),
    ('bloque 4','Ejercito de Los Andes 950, Ciudad de San Luis, Provincia de San Luis D5700HHW'),
    ('El barco','D5700HOI, Chacabuco 917, D5700HOI San Luis');

    INSERT INTO aulas(nombre,numero,"edificioId",capacidad,ubicacion) VALUES 
    ('aula',58,1,50,'planta baja'),
    ('sala',7,1,15,'planta baja'),
    ('aula',36,2,60,'planta baja'),
    ('laboratorio',6,1,20,'segundo piso'),
    ('aula',38,2,60,'planta baja'),
    ('aula',28,3,80,'planta baja'),
    ('aula',29,4,38,'primer piso'),
    ('Aula magna',0,4,100,'subusuelo');

    INSERT INTO extras("aulaId",extra) VALUES 
    (1,'Pizarron'),
    (2,'Proyector'),
    (3,'Pizarra');

    insert into facultad (nombre) VALUES 
    ('Facultad de Química, Bioquímica y Farmacia'),
    ('Facultad de Ciencias Físico-Matemáticas y Naturales'),
    ('Facultad de Ciencias Humanas'),
    ('Instituto Politécnico y Artístico Universitario'),
    ('Facultad de Ciencias de la Salud'),
    ('Facultad de Psicología'),
    ('Facultad de Turismo y Urbanismo'),
    ('Facultad de Ingeniería y Ciencias Agropecuarias'),
    ('Facultad de Ciencias Económicas Jurídicas Y Sociales');

    INSERT INTO carrera(nombre,"facultadId","cantAnios") VALUES 
    ('ANALISTA BIOLÓGICO',1,3),
    ('ANALISTA QUÍMICO',1,3),
    ('BIOQUÍMICA',1,5),
    ('FARMACIA',1,5),
    ('LICENCIATURA EN BIOLOGÍA MOLECULAR',1,5),
    ('LICENCIATURA EN BIOQUÍMICA',1,5),
    ('LICENCIATURA EN BIOTECNOLOGÍA',1,5),
    ('LICENCIATURA EN CIENCIAS BIOLÓGICAS',1,5),
    ('LICENCIATURA EN QUÍMICA',1,5), 
    ('Ingeniería EN INFORMÁTICA',2,5),
    ('Ingeniería EN COMPUTACIÓN',2,5),
    ('Ingeniería EN MINAS',2,5),
    ('LICENCIATURA EN FÍSICA',2,5),
    ('PROFESORADO EN MATEMÁTICA',2,4),
    ('LICENCIATURA EN CIENCIAS DE LA COMPUTACIÓN',2,5),
    ('PERIODISMO',3,3),    
    ('TECNICO UNIVERSITARIO EN PRODUCCIÓN MUSICAL',3,4),  
    ('TECNICATURA UNIVERSITARIA EN PRODUCCIÓN MUSICAL',3,3),  
    ('CICLO DE LICENCIATURA EN LENGUA INGLESA',3,2),  
    ('LICENCIATURA EN COMUNICACION SOCIAL',3,5),  
    ('LICENCIATURA EN PERIODISMO',3,4),  
    ('LOCUTOR NACIONAL',3,4),  
    ('Ingeniería Química',4,5),  
    ('Ingeniería Agronómica',4,5),
    ('Ingeniería Electromecánica',4,5),
    ('Ingeniería Mecatrónica',4,5);

    INSERT INTO docente(nombre,apellido,legajo,dni,"usuarioId") VALUES
    ('Mario', 'Silvestri', '355917',30651678, 1),
    ('Luis Ernesto Roqué', 'Fourcade', '458592',25987456, 2);

    INSERT INTO administrador(nombre,apellido,legajo,dni,"usuarioId") VALUES
    ('Nicolás', 'De Miguel', '355918',40123456, 3),
    ('Santiago', 'Delías', '355919',40651678, 4),
    ('Margarita', 'Maguire', '355920',41651678, 5),
    ('Luciano', 'gurruchaga', '355921',45651678, 6);
    
    INSERT INTO materia(nombre,periodo,anio,cod)  VALUES
    ('Estructura de datos y algoritmos','segundo cuatrimestre',1,1),
    ('Calculo I','primer cuatrimestre',1,2),
    ('Ingenieria web','primer cuatrimestre',4,3),
    ('Fisica I','segundo cuatrimestre',2,4),
    ('Probabilidad y estadistica','primer cuatrimestre',2,5),
    ('Ingles','anual',1,6);

    INSERT INTO reserva(dia,"horaInicio","horaFin",estado,"aulaId","docenteId") VALUES
    ('lunes',900,1100,'AUTORIZADA',2,2),
    ('martes',1700,2000,'AUTORIZADA',1,1),
    ('martes',1730,2030,'AUTORIZADA',3,1);

    INSERT INTO reservaMateria("reservaId","materiumId") VALUES
    (1,3),
    (2,1),
    (3,6);
    
   
    INSERT INTO carreraMateria("materiumId","carreraId") VALUES
    (6,10),
    (2,10),
    (2,11),
    (2,12),
    (2,13),
    (2,14),
    (2,15),
    (2,16),
    (5,10),
    (5,11),
    (5,12),
    (1,10),
    (1,11),
    (1,12),
    (4,10),
    (4,11),
    (3,10),
    (3,11);

    INSERT INTO reservaAdmin("reservaId","administradorId") VALUES
    (1,1),
    (1,2),
    (1,3),
    (1,4),
    (2,1),
    (2,2),
    (2,3),
    (2,4),
    (3,1),
    (3,2),
    (3,3),
    (3,4); 