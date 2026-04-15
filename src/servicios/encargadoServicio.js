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
    SELECT
      c.nombre AS carrera,
      p.nombre,
      p.apellido,
      cm.fecha,
      cm.hora_inicio,
      cm.hora_fin,
      cm.estado
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
      SELECT
        p.nombre,
        p.apellido,
        p.email,
        p.telefono,
        a.estado_matricula,
        c.nombre AS carrera,
        fm.numero_fila,
        fm.habilitado
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
      SELECT
        p.nombre,
        p.apellido,
        p.email,
        p.telefono,
        a.estado_matricula,
        c.nombre AS carrera
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

async function listarAspirantesEnFila() {
  const resultado = await ejecutarConsulta((request) => request.query(`
    SELECT
      a.id_aspirante,
      CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo,
      p.email,
      fm.numero_fila
    FROM Fila_Matricula fm
    INNER JOIN Aspirante a ON a.id_aspirante = fm.id_aspirante
    INNER JOIN Persona p ON p.id_persona = a.id_persona
    WHERE fm.habilitado = 1
    ORDER BY fm.numero_fila ASC
  `));
  return resultado.recordset;
}

async function asignarCita(datos) {
  return ejecutarConsulta(async (request) => {
    request.input('id_aspirante', parseInt(datos.id_aspirante, 10));
    request.input('fecha', datos.fecha);
    request.input('hora_inicio', datos.hora_inicio);
    request.input('hora_fin', datos.hora_fin);
    request.input('id_usuario', parseInt(datos.id_usuario, 10));

    const citaExistente = await request.query(`
      SELECT id_cita
      FROM Cita_Matricula
      WHERE id_aspirante = @id_aspirante
        AND estado IN ('Pendiente', 'Asignada')
    `);

    if (citaExistente.recordset.length > 0) {
      throw new Error('El aspirante ya tiene una cita pendiente o asignada.');
    }

    const insercion = await request.query(`
      INSERT INTO Cita_Matricula (id_aspirante, fecha, hora_inicio, hora_fin, estado)
      OUTPUT INSERTED.id_cita
      VALUES (@id_aspirante, @fecha, @hora_inicio, @hora_fin, 'Asignada')
    `);

    const idCita = insercion.recordset[0].id_cita;

    const encargado = await request.query(`
      SELECT e.id_encargado
      FROM Encargado e
      INNER JOIN Usuario u ON u.id_persona = e.id_persona
      WHERE u.id_usuario = @id_usuario
    `);

    if (encargado.recordset.length > 0) {
      request.input('id_cita', idCita);
      request.input('id_encargado', encargado.recordset[0].id_encargado);

      await request.query(`
        INSERT INTO Asignacion_Cita (id_cita, id_encargado, fecha_asignacion)
        VALUES (@id_cita, @id_encargado, GETDATE())
      `);
    }

    await request.query(`
      UPDATE Fila_Matricula
      SET habilitado = 0
      WHERE id_aspirante = @id_aspirante
    `);
  });
}

module.exports = {
  obtenerResumenEncargado,
  listarCitasPorCarrera,
  consultarPorEmailOTelefono,
  filtrarPorEstado,
  listarAspirantesEnFila,
  asignarCita
};