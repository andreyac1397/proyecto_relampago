const { ejecutarConsulta } = require('./baseDatos');

async function obtenerPanelAspirante(idPersona) {
  const resultado = await ejecutarConsulta((request) => {
    request.input('id_persona', idPersona);
    return request.query(`
      SELECT TOP 1
        a.id_aspirante,
        a.estado_matricula,
        a.fecha_registro,
        fm.numero_fila,
        fm.habilitado,
        fm.fecha_habilitacion,
        m.fecha_matricula,
        m.estado AS estado_matricula_formal,
        c.nombre AS carrera_matriculada
      FROM Aspirante a
      LEFT JOIN Fila_Matricula fm ON fm.id_aspirante = a.id_aspirante
      LEFT JOIN Matricula m ON m.id_aspirante = a.id_aspirante
      LEFT JOIN Carrera c ON c.id_carrera = m.id_carrera
      WHERE a.id_persona = @id_persona
    `);
  });
  return resultado.recordset[0] || null;
}

async function habilitarUsoMatricula(idPersona) {
  return ejecutarConsulta((request) => {
    request.input('id_persona', idPersona);
    return request.query(`
      UPDATE fm
      SET habilitado = 1,
          fecha_habilitacion = GETDATE()
      FROM Fila_Matricula fm
      INNER JOIN Aspirante a ON a.id_aspirante = fm.id_aspirante
      WHERE a.id_persona = @id_persona;
    `);
  });
}

async function actualizarDatosYEleccion(idPersona, datos) {
  return ejecutarConsulta(async (request) => {
    request.input('id_persona', idPersona);
    request.input('nombre', datos.nombre);
    request.input('apellido', datos.apellido);
    request.input('email', datos.email);
    request.input('telefono', datos.telefono);
    request.input('id_carrera', parseInt(datos.id_carrera, 10));

    return request.query(`
      UPDATE Persona
      SET nombre = @nombre,
          apellido = @apellido,
          email = @email,
          telefono = @telefono
      WHERE id_persona = @id_persona;

      DECLARE @id_aspirante INT;
      SELECT @id_aspirante = id_aspirante FROM Aspirante WHERE id_persona = @id_persona;

      INSERT INTO Eleccion_Carrera (id_aspirante, id_carrera, fecha_eleccion)
      VALUES (@id_aspirante, @id_carrera, CAST(GETDATE() AS DATE));

      IF NOT EXISTS (SELECT 1 FROM Matricula WHERE id_aspirante = @id_aspirante)
      BEGIN
        INSERT INTO Matricula (id_aspirante, id_carrera, estado)
        VALUES (@id_aspirante, @id_carrera, 'Pendiente');
      END
      ELSE
      BEGIN
        UPDATE Matricula SET id_carrera = @id_carrera WHERE id_aspirante = @id_aspirante;
      END
    `);
  });
}

async function indicarEstadoMatricula(idPersona, estado, observacion) {
  return ejecutarConsulta((request) => {
    request.input('id_persona', idPersona);
    request.input('estado', estado);
    request.input('observacion', observacion || null);
    return request.query(`
      UPDATE a
      SET estado_matricula = @estado
      FROM Aspirante a
      WHERE a.id_persona = @id_persona;

      UPDATE m
      SET estado = @estado,
          fecha_matricula = CASE WHEN @estado = 'Matriculado' THEN GETDATE() ELSE fecha_matricula END,
          observacion = @observacion
      FROM Matricula m
      INNER JOIN Aspirante a ON a.id_aspirante = m.id_aspirante
      WHERE a.id_persona = @id_persona;
    `);
  });
}

async function listarCarreras() {
  const resultado = await ejecutarConsulta((request) => request.query('SELECT id_carrera, nombre FROM Carrera ORDER BY nombre'));
  return resultado.recordset;
}

module.exports = {
  obtenerPanelAspirante,
  habilitarUsoMatricula,
  actualizarDatosYEleccion,
  indicarEstadoMatricula,
  listarCarreras
};
