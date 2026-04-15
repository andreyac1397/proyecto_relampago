USE RelampagoDB;
GO

-- ============================================
-- 1. PERSONA
-- ============================================
-- Se insertan Aspirantes (IDs 1-5), Encargados (IDs 6-8) y Directores (IDs 9-11)
INSERT INTO Persona (nombre, apellido, email, telefono) VALUES 
('Carlos', 'Méndez Rojas', 'cmendez.aspirante@gmail.com', '8888-1111'),
('Ana', 'Solís Vargas', 'asolis.aspirante@hotmail.com', '8888-2222'),
('Luis', 'Ramírez Castro', 'lramirez.aspirante@yahoo.es', '8888-3333'),
('María', 'Fernández Soto', 'mfersoto.aspirante@gmail.com', '8888-4444'),
('Jorge', 'Brenes Mora', 'jbrenes.aspirante@gmail.com', '8888-5555'),
('Pedro', 'Alvarado Ruiz', 'palvarado.registro@universidad.edu', '2222-1111'),
('Laura', 'Gómez Núñez', 'lgomez.registro@universidad.edu', '2222-1112'),
('Andrés', 'Vega Salas', 'avega.registro@universidad.edu', '2222-1113'),
('Carmen', 'Pérez Navarro', 'cperez.dir@universidad.edu', '2222-2221'),
('Roberto', 'Sánchez López', 'rsanchez.dir@universidad.edu', '2222-2222'),
('Elena', 'Cruz Morales', 'ecruz.dir@universidad.edu', '2222-2223');

-- ============================================
-- 2. CARRERA
-- ============================================
INSERT INTO Carrera (nombre, descripcion) VALUES
('Ingeniería en Sistemas de Información', 'Formación de profesionales en el área de desarrollo de software, bases de datos y gestión de TI.'),
('Administración de Negocios', 'Preparación integral para la gestión, planeamiento y dirección de empresas modernas.'),
('Diseño Gráfico', 'Carrera enfocada en comunicación visual, ilustración, animación y diseño digital.'),
('Medicina y Cirugía', 'Formación médica integral con énfasis en investigación y prácticas clínicas hospitalarias.'),
('Derecho', 'Estudio de las ciencias jurídicas, resolución de conflictos y normativas nacionales e internacionales.');

-- ============================================
-- 3. ASPIRANTE
-- ============================================
-- Enlazamos a las primeras 5 personas creadas
INSERT INTO Aspirante (id_persona, estado_matricula) VALUES
(1, 'Pendiente'),
(2, 'Admitido'),
(3, 'En Proceso'),
(4, 'Pendiente'),
(5, 'Rechazado');

-- ============================================
-- 4. ELECCION DE CARRERA
-- ============================================
-- Relaciona a los aspirantes con las carreras que desean
INSERT INTO Eleccion_Carrera (id_aspirante, id_carrera, fecha_eleccion) VALUES
(1, 1, '2024-01-15'), -- Carlos elige Ingeniería
(1, 2, '2024-01-15'), -- Carlos elige como 2da opción Administración
(2, 4, '2024-01-18'), -- Ana elige Medicina
(3, 1, '2024-01-20'), -- Luis elige Ingeniería
(4, 5, '2024-02-05'), -- María elige Derecho
(5, 3, '2024-02-10'); -- Jorge elige Diseño

-- ============================================
-- 5. CITA DE MATRÍCULA
-- ============================================
INSERT INTO Cita_Matricula (id_aspirante, fecha, hora_inicio, hora_fin, estado) VALUES
(1, '2024-03-01', '08:00:00', '08:30:00', 'Programada'),
(2, '2024-03-01', '08:30:00', '09:00:00', 'Atendida'),
(3, '2024-03-02', '09:00:00', '09:30:00', 'Programada'),
(4, '2024-03-02', '10:00:00', '10:30:00', 'Cancelada');

-- ============================================
-- 6. ENCARGADO
-- ============================================
-- Enlazamos a las personas del ID 6 al 8 como empleados encargados
INSERT INTO Encargado (id_persona) VALUES
(6),
(7),
(8);

-- ============================================
-- 7. ASIGNACION DE CITA
-- ============================================
INSERT INTO Asignacion_Cita (id_cita, id_encargado, fecha_asignacion) VALUES
(1, 1, '2024-02-20 10:00:00'), -- Pedro atiende la Cita de Carlos
(2, 2, '2024-02-20 10:15:00'), -- Laura atiende la Cita de Ana
(3, 1, '2024-02-21 08:00:00'), -- Pedro atiende a Luis
(4, 3, '2024-02-21 09:30:00'); -- Andrés atiende a María

-- ============================================
-- 8. DIRECTOR DE CARRERA
-- ============================================
-- Enlazamos las personas del ID 9 al 11 a diferentes carreras
INSERT INTO Director_Carrera (id_persona, id_carrera) VALUES
(9, 1),  -- Carmen es directora de Ingeniería
(10, 2), -- Roberto es director de Administración
(11, 4); -- Elena es directora de Medicina

-- ============================================
-- 9. CORREO
-- ============================================
INSERT INTO Correo (asunto, mensaje, fecha_envio) VALUES
('Bienvenido al Proceso de Admisión', 'Estimado aspirante, hemos recibido su solicitud de ingreso con éxito. Pronto le notificaremos la fecha de su cita de matrícula.', '2024-01-25 08:00:00'),
('Recordatorio de Cita de Matrícula', 'Le recordamos que tiene una cita de matrícula programada. Por favor sea puntual y presente la documentación requerida.', '2024-02-22 09:00:00'),
('Notificación de Admisión', 'Felicidades, le informamos que ha sido admitido exitosamente en la carrera de su preferencia.', '2024-03-05 14:00:00');

-- ============================================
-- 10. ENVÍO DE CORREO
-- ============================================
INSERT INTO Envio_Correo (id_correo, id_persona) VALUES
(1, 1), -- Correo de ingreso a Carlos
(1, 2), -- Correo de ingreso a Ana
(1, 3), -- Correo de ingreso a Luis
(2, 1), -- Recordatorio de cita a Carlos
(2, 2), -- Recordatorio de cita a Ana
(3, 2); -- Admisión enviada a Ana
