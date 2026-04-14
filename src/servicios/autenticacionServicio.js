const { ejecutarConsulta } = require('./baseDatos');

async function buscarUsuarioPorCredenciales(nombreUsuario) {
  const resultado = await ejecutarConsulta((request) => {
    request.input('nombre_usuario', nombreUsuario);
    return request.query(`
      SELECT TOP 1
        u.id_usuario,
        u.nombre_usuario,
        u.clave,
        u.rol,
        u.estado,
        p.id_persona,
        p.nombre,
        p.apellido,
        p.email,
        p.telefono
      FROM Usuario u
      INNER JOIN Persona p ON p.id_persona = u.id_persona
      WHERE u.nombre_usuario = @nombre_usuario
    `);
  });

  return resultado.recordset[0] || null;
}

module.exports = { buscarUsuarioPorCredenciales };
