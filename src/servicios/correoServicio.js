const { obtenerConexion, sql } = require('./baseDatos');

async function registrarCorreo(asunto, mensaje, idsPersona) {
  const conexion = await obtenerConexion();
  const transaccion = new sql.Transaction(conexion);

  await transaccion.begin();
  try {
    const requestCorreo = new sql.Request(transaccion);
    requestCorreo.input('asunto', sql.VarChar(200), asunto);
    requestCorreo.input('mensaje', sql.VarChar(sql.MAX), mensaje);

    const insercion = await requestCorreo.query(`
      INSERT INTO Correo (asunto, mensaje)
      OUTPUT INSERTED.id_correo
      VALUES (@asunto, @mensaje)
    `);

    const idCorreo = insercion.recordset[0].id_correo;

    for (const idPersona of idsPersona) {
      const reqEnvio = new sql.Request(transaccion);
      reqEnvio.input('id_correo', sql.Int, parseInt(idCorreo, 10));
      reqEnvio.input('id_persona', sql.Int, parseInt(idPersona, 10));
      await reqEnvio.query(`
        INSERT INTO Envio_Correo (id_correo, id_persona)
        VALUES (@id_correo, @id_persona)
      `);
    }

    await transaccion.commit();
    return { idCorreo };
  } catch (error) {
    await transaccion.rollback();
    throw error;
  }
}

async function obtenerPersonasPorEstado(estado) {
  const conexion = await obtenerConexion();
  const request = conexion.request();
  request.input('estado', sql.VarChar(20), estado);
  const resultado = await request.query(`
    SELECT p.id_persona, CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo, p.email
    FROM Persona p
    INNER JOIN Aspirante a ON a.id_persona = p.id_persona
    WHERE a.estado_matricula = @estado
    ORDER BY p.nombre, p.apellido
  `);
  return resultado.recordset;
}

module.exports = { registrarCorreo, obtenerPersonasPorEstado };
