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
    periodo period,
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
CREATE TABLE IF NOT EXISTS comentario(
    id SERIAL PRIMARY KEY, 
    texto TEXT,
    "aulaId" integer REFERENCES aulas(id),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS comentarioDocente(
    "comentarioId" smallint REFERENCES comentario(id),
    "docenteId" smallint REFERENCES docente(id),
    state situation DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("comentarioId","docenteId")
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
    ('admin4','0000', 'ADMIN'),
    ('csalgado','0000', 'DOCENTE');


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
    ('Facultad de Ciencias Humanas');

    INSERT INTO carrera(nombre,"facultadId","cantAnios") VALUES 
    -- Facultad de Química, Bioquímica y Farmacia 
    ('ANALISTA BIOLÓGICO',1,4),
    ('ANALISTA QUÍMICO',1,3),
    ('BIOQUÍMICA',1,5),
    ('FARMACIA',1,5),
    -- Facultad de Ciencias Físico-Matemáticas y Naturales
    ('INGENIERÍA EN INFORMÁTICA',2,5),
    ('INGENIERÍA EN COMPUTACIÓN',2,5),
    ('INGENIERÍA EN MINAS',2,5),
    ('INGENIERÍA ELECTRÓNICA CON ORIENTACIÓN EN SISTEMAS DIGITALES',2,5),
    -- Facultad de Ciencias Humanas
    ('LICENCIATURA EN CIENCIAS DE LA EDUCACION',3,5),    
    ('LICENCIATURA EN COMUNICACION SOCIAL',3,4),  
    ('LICENCIATURA EN EDUCACION INICIAL',3,4),  
    ('LICENCIATURA EN PERIODISMO',3,4);
    

    INSERT INTO docente(nombre,apellido,legajo,dni,"usuarioId") VALUES
    ('Mario', 'Silvestri', '355917',30651678, 1),
    ('Luis Ernesto Roqué', 'Fourcade', '458592',25987456, 2),
    ('Carlos','Salgado','284598',32753951,7);

    INSERT INTO administrador(nombre,apellido,legajo,dni,"usuarioId") VALUES
    ('Nicolás', 'De Miguel', '355918',40123456, 3),
    ('Santiago', 'Delías', '355919',40651679, 4),
    ('Margarita', 'Maguire', '355920',41651678, 5),
    ('Luciano', 'Gurruchaga', '355921',45651678, 6);
    
    INSERT INTO materia(nombre,periodo,anio,cod)  VALUES
    -- ANALISTA BIOLÓGICO
    ('QUIMICA GENERAL E INORGANICA','primer cuatrimestre',1,1),
    ('CURSO APROXIMACION A LA BIOLOGIA','primer cuatrimestre',1,2),
    ('BIOLOGIA I','segundo cuatrimestre',1,3),
    ('INSTRUMENTAL','segundo cuatrimestre',1,4),
    ('QUIMICA ORGANICA','primer cuatrimestre',2,5),
    ('COMPUTACION','segundo cuatrimestre',2,6),
    ('BIOLOGIA II','primer cuatrimestre',3,7),
    ('BROMATOLOGIA DEL ALIMENTO','segundo cuatrimestre',3,8),
    ('PRACTICANATO DEL LABORATORIO BIOLOGICO','primer cuatrimestre',4,9),
    -- ANALISTA QUÍMICO
    ('TRABAJO DE LABORATORIO Y COMPUTACION','primer cuatrimestre',1,10), 
    ('QUIMICA GENERAL','primer cuatrimestre',1,11), 
    ('MATEMATICA','segundo cuatrimestre',1,12), 
    ('QUIMICA INORGANICA','segundo cuatrimestre',1,13), 
    ('MATEMATICAS ESPECIALES','primer cuatrimestre',2,14), 
    ('FISICA','primer cuatrimestre',2,15), 
    ('ESTADISTICA','segundo cuatrimestre',2,16), 
    ('TECNICAS SEPARATIVAS','primer cuatrimestre',3,17), 
    ('PROCESO ANALITICO TOTAL','segundo cuatrimestre',3,18), 
    -- BIOQUÍMICA
    --('QUIMICA GENERAL','primer cuatrimestre',1,11), 
    --('QUIMICA INORGANICA','segundo cuatrimestre',1,13),
    ('QUIMICA ORGANICA I','primer cuatrimestre',2,19),
    ('QUIMICA ANALITICA I','segundo cuatrimestre',2,20), 
    ('ANATOMIA HUMANA','primer cuatrimestre',3,21), 
    ('QUIMICA ANALITICA II','segundo cuatrimestre',3,22), 
    ('INMUNOLOGIA','primer cuatrimestre',4,23), 
    ('BROMATOLOGIA','segundo cuatrimestre',5,24),
    -- FARMACIA
    ('PROBLEMÁTICA DE LA SALUD','primer cuatrimestre',1,25),    
    ('TALLER: ROL SOCIAL, CIENTÍFICO Y PROFESIONAL','segundo cuatrimestre',1,26),    
    ('TALLER: LIDERAZGO PROFESIONAL','primer cuatrimestre',2,27),    
    ('QUIMICA FISICA','segundo cuatrimestre',2,28),    
    ('FISIOLOGIA','primer cuatrimestre',3,29),    
    ('FARMACOGNOSIA','segundo cuatrimestre',3,30),    
    ('INGLES','anual',4,31),    
    ('PRACTICA PROFESIONAL','anual',5,32),

    -- INGENIERÍA EN INFORMÁTICA
    ('INGLES','anual',1,33),
    ('CALCULO I','primer cuatrimestre',1,34),
    ('ALGEBRA II','segundo cuatrimestre',1,35),
    ('PROBABILIDAD Y ESTADISTICA','primer cuatrimestre',2,36),
    ('PROGRAMACION II','segundo cuatrimestre',2,37),
    ('CALCULO II','primer cuatrimestre',2,38),
    ('INGENIERIA DE SOFTWARE I','segundo cuatrimestre',2,39),
    ('MODELOS Y SIMULACION','primer cuatrimestre',3,40),
    ('SISTEMAS OPERATIVOS','segundo cuatrimestre',3,41),
    ('INGENIERIA WEB','primer cuatrimestre',4,42),
    ('SISTEMAS INTELIGENTES','segundo cuatrimestre',4,43),
    ('ARQUITECTURA DE SOFTWARE','primer cuatrimestre',5,44),
    -- INGENIERÍA EN COMPUTACIÓN
    -- ('INGLES','anual',1,33),
    -- ('CALCULO I','primer cuatrimestre',1,34),
    -- ('ALGEBRA II','segundo cuatrimestre',1,35),
    -- ('PROBABILIDAD Y ESTADISTICA','primer cuatrimestre',2,36),
    -- ('PROGRAMACION II','segundo cuatrimestre',2,37),
    -- ('CALCULO II','primer cuatrimestre',2,38),
    ('CIRCUITOS ELECTRICOS','segundo cuatrimestre',2,45),
    ('ELECTRONICA DIGITAL','primer cuatrimestre',3,46),
    ('ELECTRONICA GENERAL','segundo cuatrimestre',3,47),
    ('PROCESAMIENTO DIGITAL DE SEÑALES','primer cuatrimestre',4,48),
    ('ESPECIFICACION DE CIRCUITOS DIGITALES','segundo cuatrimestre',4,49),
    ('SISTEMAS DISTRIBUIDOS Y PARALELOS','primer cuatrimestre',5,50),
    -- INGENIERÍA EN MINAS
    -- ('CALCULO I','primer cuatrimestre',1,34),
    -- ('ALGEBRA II','segundo cuatrimestre',1,35),
    ('INTRODUCCION A LA INGENIERIA','primer cuatrimestre',1,51),
    ('QUIMICA','segundo cuatrimestre',1,52),
    ('FISICA II','primer cuatrimestre',2,53),
    -- ('CALCULO II','primer cuatrimestre',2,38),
    ('ELECTROTECNIA','segundo cuatrimestre',2,54),
    ('QUIMICA ANALITICA','segundo cuatrimestre',2,55),
    ('MINERALOGIA','primer cuatrimestre',3,56),
    ('LABOREO I','segundo cuatrimestre',3,57),
    ('SIMULACION DE PROCESOS MINEROS','primer cuatrimestre',4,58),
    ('TOPOGRAFIA','segundo cuatrimestre',4,59),
    ('PRACTICAS PRE-PROFESIONALES','anual',5,60),
    -- INGENIERÍA ELECTRÓNICA CON ORIENTACIÓN EN SISTEMAS DIGITALES
    -- ('INGLES','anual',1,33),
    -- ('CALCULO I','primer cuatrimestre',1,34),
    -- ('ALGEBRA II','segundo cuatrimestre',1,35),
    -- ('CALCULO II','primer cuatrimestre',2,38),
    ('PROCESADORES I','segundo cuatrimestre',2,61),
    ('PROCESADORES II','primer cuatrimestre',3,62),
    ('INTERFASES','segundo cuatrimestre',3,63),
    ('PROCESAMIENTO DIGITAL DE SEÑALES I','primer cuatrimestre',4,64),
    ('AUTOMATIZACION INDUSTRIAL','segundo cuatrimestre',4,65),
    ('COMUNICACIONES II','primer cuatrimestre',5,66),

    -- LICENCIATURA EN CIENCIAS DE LA EDUCACION
    ('PEDAGOGIA GENERAL','primer cuatrimestre',1,67),
    ('FILOSOFIA Y ETICA','segundo cuatrimestre',1,68),
    ('NIVEL II TALLER SUJETOS DE APRENDIZAJE EN DIFERENTES CONTEXTOS.','anual',2,69),
    ('SOCIOLOGIA DE LA EDUCACION','primer cuatrimestre',2,70),
    ('FILOSOFIA DE LA EDUCACION','segundo cuatrimestre',2,71),
    ('DIDACTICA Y CURRICULUM','anual',3,72),
    ('INVESTIGACION EDUCATIVA I','segundo cuatrimestre',3,73),
    ('INVESTIGACION EDUCATIVA II','anual',4,74),
    ('PROBLEMATICA PEDAGOGICA DIDACTICA DEL NIVEL SUPERIOR','primer cuatrimestre',4,75),
    ('PLANEAMIENTO EDUCACIONAL','primer cuatrimestre',5,76),
    -- LICENCIATURA EN COMUNICACION SOCIAL
    ('COMPRENSION Y PRODUCCION DE TEXTOS','anual',1,77),
    ('FILOSOFIA','primer cuatrimestre',1,78),
    ('TECNOLOGIA DE LA COMUNICACION I','segundo cuatrimestre',1,79),
    ('COMUNICACION RADIOFONICA','anual',2,80),
    ('TECNOLOGIA DE LA COMUNICACION II','primer cuatrimestre',2,81),
    ('COMUNICACION GRAFICA','anual',3,82),
    ('METODOLOGIA DE LA INVESTIGACION','segundo cuatrimestre',3,83),
    ('PRODUCCION Y REALIZACION GRAFICA','anual',4,84),
    ('COMUNICACION EDUCATIVA','anual',4,85),
    ('PRACTICA PREPROFESIONAL','anual',5,86),
    -- LICENCIATURA EN EDUCACION INICIAL
    ('PEDAGOGIA','primer cuatrimestre',1,87),
    ('EDUCACION PARA LA SALUD INFANTIL','segundo cuatrimestre',1,88),
    ('JARDIN MATERNAL','primer cuatrimestre',2,89),
    ('EDUCACION FISICA','segundo cuatrimestre',2,90),
    ('CIENCIAS NATURALES Y SU DIDACTICA','primer cuatrimestre',3,91),
    ('EDUCACION INFANTIL E INFORMATICA','segundo cuatrimestre',3,92),
    ('EPISTEMOLOGIA','primer cuatrimestre',4,93),
    ('POLITICAS PUBLICAS Y DERECHOS DEL NIÑO','segundo cuatrimestre',4,94),
    -- LICENCIATURA EN PERIODISMO
    -- ('COMPRENSION Y PRODUCCION DE TEXTOS','anual',1,77),
    ('FONIATRIA','anual',1,95),
    ('HISTORIA CONTEMPORANEA','primer cuatrimestre',1,96),
    ('TALLER DE PERIODISMO RADIOFONICO','anual',2,97),
    ('TECNOLOGIA DE LA COMUNICACION II','primer cuatrimestre',2,98),
    ('SEMINARIO DE PERIODISMO Y LITERATURA','segundo cuatrimestre',2,99),
    ('TALLER DE PERIODISMO TELEVISIVO','anual',3,100),
    ('COMUNICACION MULTIMEDIAL','primer cuatrimestre',3,101),
    -- ('EPISTEMOLOGIA','primer cuatrimestre',4,93),
    ('POLITICA Y COMUNICACION','segundo cuatrimestre',4,102);
    
   
    INSERT INTO carreraMateria("materiumId","carreraId") VALUES
    -- ANALISTA BIOLÓGICO (,1),
    (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),
    -- ANALISTA QUÍMICO (,2),
    (10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),
    -- BIOQUÍMICA (,3),
    (11,3),(13,3),(19,3),(20,3),(21,3),(22,3),(23,3),(24,3),
    -- FARMACIA (,4),
    (25,4),(26,4),(27,4),(28,4),(29,4),(30,4),(31,4),(32,4),

    -- INGENIERÍA EN INFORMÁTICA (,5),
    (33,5),(34,5),(35,5),(36,5),(37,5),(38,5),(39,5),(40,5),(41,5),(42,5),(43,5),
    -- INGENIERÍA EN COMPUTACIÓN (,6),
    (33,6),(34,6),(35,6),(36,6),(37,6),(38,6),(45,6),(46,6),(47,6),(48,6),(49,6),(50,6),
    -- INGENIERÍA EN MINAS (,7),
    (34,7),(35,7),(51,7),(52,7),(53,7),(38,7),(54,7),(55,7),(56,7),(57,7),(58,7),(59,7),(60,7),
    -- INGENIERÍA ELECTRÓNICA CON ORIENTACIÓN EN SISTEMAS DIGITALES (,8),
    (33,8),(34,8),(35,8),(38,8),(61,8),(62,8),(63,8),(64,8),(65,8),(66,8),

    -- LICENCIATURA EN CIENCIAS DE LA EDUCACION (,9),
    (67,9),(68,9),(69,9),(70,9),(71,9),(72,9),(73,9),(74,9),(75,9),(76,9),
    -- LICENCIATURA EN COMUNICACION SOCIAL (,10),
    (77,10),(78,10),(79,10),(80,10),(81,10),(82,10),(83,10),(84,10),(85,10),(86,10),
    -- LICENCIATURA EN EDUCACION INICIAL (,11), 
    (93,11), (94,11), (87,11), (88,11), (89,11), (90,11), (91,11), (92,11), 
    -- LICENCIATURA EN PERIODISMO (,12),
    (77,12),(102,12),(101,12),(95,12),(96,12),(97,12),(98,12),(99,12),(93,12),(100,12);