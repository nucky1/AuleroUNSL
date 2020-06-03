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
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS edificio(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    direccion text NOT NULL CHECK (direccion <> ''),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
DROP TABLE IF EXISTS aulas;
CREATE TABLE IF NOT EXISTS aulas(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    nombre text NOT NULL CHECK (nombre <> ''),
    numero integer NOT NULL,
    idEdificio smallint,
    capacidad integer NOT NULL,
    extras chiches,
    ubicacion text NOT NULL CHECK (ubicacion <> ''),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (idEdificio) REFERENCES edificio(id)
);
CREATE TABLE IF NOT EXISTS facultad(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS carrera(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),   
    idFacultad smallint,
    FOREIGN KEY (idFacultad) REFERENCES facultad(id),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS docente(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    apellido text NOT NULL CHECK (apellido <> ''),
    legajo text NOT NULL CHECK (legajo <> ''),
    dni integer NOT NULL,
    idUsuario smallint,
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS administrador(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    apellido text NOT NULL CHECK (apellido <> ''),
    legajo text NOT NULL CHECK (legajo <> ''),
    dni integer NOT NULL,
    idUsuario smallint,
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS materia(
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL CHECK (nombre <> ''),
    periodo period,
    anio integer NOT NULL,
    cod integer UNIQUE,
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS reserva(
    id SERIAL PRIMARY KEY,
    dia dias,
    horaInicio integer NOT NULL,
    horaFin integer NOT NULL,
    estado state,
    idAula smallint REFERENCES aulas(id),
    idDocente smallint REFERENCES docente(id),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS reservaMateria(
    idReserva smallint REFERENCES reserva(id),
    codMateria integer REFERENCES materia(cod),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (idReserva,codMateria)
);
CREATE TABLE IF NOT EXISTS carreraMateria(
    codMateria integer REFERENCES materia(cod),
    idCarrera smallint REFERENCES carrera(id),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (codMateria,idCarrera)
);
CREATE TABLE IF NOT EXISTS reservaAdmin(
    idReserva smallint REFERENCES reserva(id),
    idAdministrador integer REFERENCES administrador(id),
    state situation DEFAULT 'ACTIVA',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (idReserva,idAdministrador)
);
CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updatedAt = now();
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