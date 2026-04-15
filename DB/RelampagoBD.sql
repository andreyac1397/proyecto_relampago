use RelampagoDB


-- ============================================
-- 1. PERSONA
-- ============================================
CREATE TABLE Persona (
    id_persona INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20)
);

-- ============================================
-- 2. CARRERA
-- ============================================
CREATE TABLE Carrera (
    id_carrera INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(100),
    descripcion TEXT
);

-- ============================================
-- 3. ASPIRANTE
-- ============================================
CREATE TABLE Aspirante (
    id_aspirante INT PRIMARY KEY IDENTITY,
    id_persona INT,
    estado_matricula VARCHAR(20),
    FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
);

-- ============================================
-- 4. ELECCION DE CARRERA
-- ============================================
CREATE TABLE Eleccion_Carrera (
    id_eleccion INT PRIMARY KEY IDENTITY,
    id_aspirante INT,
    id_carrera INT,
    fecha_eleccion DATE,
    FOREIGN KEY (id_aspirante) REFERENCES Aspirante(id_aspirante),
    FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera)
);

-- ============================================
-- 5. CITA DE MATRÍCULA
-- ============================================
CREATE TABLE Cita_Matricula (
    id_cita INT PRIMARY KEY IDENTITY,
    id_aspirante INT,
    fecha DATE,
    hora_inicio TIME,
    hora_fin TIME,
    estado VARCHAR(20),
    FOREIGN KEY (id_aspirante) REFERENCES Aspirante(id_aspirante)
);

-- ============================================
-- 6. ENCARGADO
-- ============================================
CREATE TABLE Encargado (
    id_encargado INT PRIMARY KEY IDENTITY,
    id_persona INT,
    FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
);

-- ============================================
-- 7. ASIGNACION DE CITA
-- ============================================
CREATE TABLE Asignacion_Cita (
    id_asignacion INT PRIMARY KEY IDENTITY,
    id_cita INT,
    id_encargado INT,
    fecha_asignacion DATETIME,
    FOREIGN KEY (id_cita) REFERENCES Cita_Matricula(id_cita),
    FOREIGN KEY (id_encargado) REFERENCES Encargado(id_encargado)
);

-- ============================================
-- 8. DIRECTOR DE CARRERA
-- ============================================
CREATE TABLE Director_Carrera (
    id_director INT PRIMARY KEY IDENTITY,
    id_persona INT,
    id_carrera INT,
    FOREIGN KEY (id_persona) REFERENCES Persona(id_persona),
    FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera)
);

-- ============================================
-- 9. CORREO
-- ============================================
CREATE TABLE Correo (
    id_correo INT PRIMARY KEY IDENTITY,
    asunto VARCHAR(200),
    mensaje TEXT,
    fecha_envio DATETIME
);

-- ============================================
-- 10. ENVÍO DE CORREO
-- ============================================
CREATE TABLE Envio_Correo (
    id_envio INT PRIMARY KEY IDENTITY,
    id_correo INT,
    id_persona INT,
    FOREIGN KEY (id_correo) REFERENCES Correo(id_correo),
    FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================