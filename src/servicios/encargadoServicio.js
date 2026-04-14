const { ejecutarConsulta } = require('./baseDatos');

async function obtenerResumenEncargado() {
  const resultado = await ejecutarConsulta((request) => request.query(`
    SELECT
      (SELECT COUNT(*) FROM Cita_Matricula) AS totalCitas,
      (SELECT COUNT(*) FROM Aspirante WHERE estado_matricula = 'Matriculado') AS matriculados,
      (SELECT COUNT(*) FROM Aspirante WHERE estado_matricula = 'No matriculado') AS noMatriculados,
      (SELECT COUNT(*) FROM Fila_Matricula WHERE habilitado = 1) AS filasHabilitadas
  `));
  return resultado.recordset[0];
}

async function listarCitasPorCarrera() {
  const resultado = await ejecutarConsulta((request) => request.query(`
    SELECT c.nombre AS carrera, p.nombre, p.apellido, cm.fecha, cm.hora_inicio, cm.hora_fin, cm.estado
    FROM Cita_Matricula cm
    INNER JOIN Aspirante a ON a.id_aspirante = cm.id_aspirante
    INNER JOIN Persona p ON p.id_persona = a.id_persona
    LEFT JOIN Matricula m ON m.id_aspirante = a.id_aspirante
    LEFT JOIN Carrera c ON c.id_carrera = m.id_carrera
    ORDER BY c.nombre, cm.fecha, cm.hora_inicio
  `));
  return resultado.recordset;
}

async function consultarPorEmailOTelefono(texto) {
  const resultado = await ejecutarConsulta((request) => {
    request.input('texto', `%${texto}%`);
    return request.query(`
      SELECT p.nombre, p.apellido, p.email, p.telefono, a.estado_matricula,
             c.nombre AS carrera, fm.numero_fila, fm.habilitado
      FROM Persona p
      INNER JOIN Aspirante a ON a.id_persona = p.id_persona
      LEFT JOIN Matricula m ON m.id_aspirante = a.id_aspirante
      LEFT JOIN Carrera c ON c.id_carrera = m.id_carrera
      LEFT JOIN Fila_Matricula fm ON fm.id_aspirante = a.id_aspirante
      WHERE p.email LIKE @texto OR p.telefono LIKE @texto
      ORDER BY p.nombre, p.apellido
    `);
  });
  return resultado.recordset;
}

async function filtrarPorEstado(estado) {
  const resultado = await ejecutarConsulta((request) => {
    request.input('estado', estado);
    return request.query(`
      SELECT p.nombre, p.apellido, p.email, p.telefono, a.estado_matricula, c.nombre AS carrera
      FROM Aspirante a
      INNER JOIN Persona p ON p.id_persona = a.id_persona
      LEFT JOIN Matricula m ON m.id_aspirante = a.id_aspirante
      LEFT JOIN Carrera c ON c.id_carrera = m.id_carrera
      WHERE a.estado_matricula = @estado
      ORDER BY p.nombre, p.apellido
    `);
  });
  return resultado.recordset;
}

async function asignarFilaYMatricula(datos) {
  return ejecutarConsulta((request) => {
    request.input('id_aspirante', parseInt(datos.id_aspirante, 10));
    request.input('numero_fila', parseInt(datos.numero_fila, 10));
    request.input('id_carrera', parseInt(datos.id_carrera, 10));
    return request.query(`
      IF NOT EXISTS (SELECT 1 FROM Fila_Matricula WHERE id_aspirante = @id_aspirante)
      BEGIN
        INSERT INTO Fila_Matricula (id_aspirante, numero_fila, habilitado, fecha_habilitacion)
        VALUES (@id_aspirante, @numero_fila, 1, GETDATE())
      END
      ELSE
      BEGIN
        UPDATE Fila_Matricula
        SET numero_fila = @numero_fila,
            habilitado = 1,
            fecha_habilitacion = GETDATE()
        WHERE id_aspirante = @id_aspirante
      END

      IF NOT EXISTS (SELECT 1 FROM Matricula WHERE id_aspirante = @id_aspirante)
      BEGIN
        INSERT INTO Matricula (id_aspirante, id_carrera, estado)
        VALUES (@id_aspirante, @id_carrera, 'Pendiente')
      END
      ELSE
      BEGIN
        UPDATE Matricula
        SET id_carrera = @id_carrera
        WHERE id_aspirante = @id_aspirante
      END
    `);
  });
}

async function listarAspirantes() {
  const resultado = await ejecutarConsulta((request) => request.query(`
    SELECT a.id_aspirante, CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo, p.email
    FROM Aspirante a
    INNER JOIN Persona p ON p.id_persona = a.id_persona
    ORDER BY p.nombre, p.apellido
  `));
  return resultado.recordset;
}

async function listarCarreras() {
  const resultado = await ejecutarConsulta((request) => request.query(`SELECT id_carrera, nombre FROM Carrera ORDER BY nombre`));
  return resultado.recordset;
}

module.exports = {
  obtenerResumenEncargado,
  listarCitasPorCarrera,
  consultarPorEmailOTelefono,
  filtrarPorEstado,
  asignarFilaYMatricula,
  listarAspirantes,
  listarCarreras
};
