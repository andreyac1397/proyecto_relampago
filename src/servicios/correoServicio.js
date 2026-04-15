const { obtenerConexion, sql } = require('./baseDatos');
const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_USUARIO,
    pass: process.env.CORREO_CONTRASENA,
  }
});

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

    // Obtener emails de las personas seleccionadas
    const idsParsed = idsPersona.map(id => parseInt(id, 10));
    const requestEmails = new sql.Request(transaccion);
    const resultado = await requestEmails.query(`
      SELECT p.id_persona, CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo, p.email
      FROM Persona p
      WHERE p.id_persona IN (${idsParsed.join(',')})
    `);
    const personas = resultado.recordset;

    for (const idPersona of idsParsed) {
      const reqEnvio = new sql.Request(transaccion);
      reqEnvio.input('id_correo', sql.Int, idCorreo);
      reqEnvio.input('id_persona', sql.Int, idPersona);
      await reqEnvio.query(`
        INSERT INTO Envio_Correo (id_correo, id_persona)
        VALUES (@id_correo, @id_persona)
      `);
    }

    await transaccion.commit();

    // Enviar correos DESPUÉS de confirmar la transacción
    const erroresEnvio = [];
    for (const persona of personas) {
      try {
        await transporter.sendMail({
          from: `"RELAPAGO" <${process.env.CORREO_USUARIO}>`,
          to: persona.email,
          subject: asunto,
          html: `
            <p>Estimado/a <strong>${persona.nombre_completo}</strong>,</p>
            <p>${mensaje}</p>
            <br>
            <p>Atentamente,<br>Sistema RELAPAGO</p>
          `,
        });
      } catch (errorEnvio) {
        // Si un correo falla, se registra pero no se revierten los demás
        erroresEnvio.push({ persona: persona.email, error: errorEnvio.message });
        console.error(`Error al enviar a ${persona.email}:`, errorEnvio.message);
      }
    }

    return { idCorreo, erroresEnvio };

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
