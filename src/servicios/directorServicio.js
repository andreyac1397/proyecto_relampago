const { ejecutarConsulta } = require('./baseDatos');

async function obtenerCarrerasDelDirector(idPersona, rol) {
  const resultado = await ejecutarConsulta((request) => {
    if (rol === 'Administrador' || rol === 'Encargado') {
      return request.query(`
        SELECT id_carrera, nombre
        FROM Carrera
        ORDER BY nombre
      `);
    } else {
      request.input('id_persona', idPersona);
      return request.query(`
        SELECT c.id_carrera, c.nombre
        FROM Director_Carrera dc
        INNER JOIN Carrera c ON c.id_carrera = dc.id_carrera
        WHERE dc.id_persona = @id_persona
        ORDER BY c.nombre
      `);
    }
  });
  return resultado.recordset;
}

async function obtenerCarrerasConMatriculadosDelDirector(idPersona, rol) {
  const resultado = await ejecutarConsulta((request) => {
    if (rol === 'Administrador' || rol === 'Encargado') {
      return request.query(`
        SELECT DISTINCT c.id_carrera, c.nombre
        FROM Carrera c
        INNER JOIN Matricula m ON m.id_carrera = c.id_carrera
        ORDER BY c.nombre
      `);
    } else {
      request.input('id_persona', idPersona);
      return request.query(`
        SELECT DISTINCT c.id_carrera, c.nombre
        FROM Director_Carrera dc
        INNER JOIN Carrera c ON c.id_carrera = dc.id_carrera
        INNER JOIN Matricula m ON m.id_carrera = c.id_carrera
        WHERE dc.id_persona = @id_persona
        ORDER BY c.nombre
      `);
    }
  });
  return resultado.recordset;
}

async function consultarMatriculadosPorCarrera(idCarrera) {
  const resultado = await ejecutarConsulta((request) => {
    request.input('id_carrera', parseInt(idCarrera, 10));
    return request.query(`
      SELECT p.id_persona, p.nombre, p.apellido, p.email, p.telefono, a.estado_matricula AS estado, m.fecha_matricula
      FROM Matricula m
      INNER JOIN Aspirante a ON a.id_aspirante = m.id_aspirante
      INNER JOIN Persona p ON p.id_persona = a.id_persona
      WHERE m.id_carrera = @id_carrera
      ORDER BY p.nombre, p.apellido
    `);
  });
  return resultado.recordset;
}

module.exports = {
  obtenerCarrerasDelDirector,
  obtenerCarrerasConMatriculadosDelDirector,
  consultarMatriculadosPorCarrera
};
