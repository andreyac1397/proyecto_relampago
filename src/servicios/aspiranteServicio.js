const { ejecutarConsulta } = require('./baseDatos');

async function obtenerPanelAspirante(idPersona) {
  const resultado = await ejecutarConsulta((request) => {
    request.input('id_persona', idPersona);
    return request.query(`
      SELECT
        a.id_aspirante,
        a.estado_matricula,
        a.fecha_registro,

        p.nombre,
        p.apellido,
        p.email,
        p.telefono,

        fm.numero_fila,
        ISNULL(fm.habilitado, 0) AS habilitado,
        fm.fecha_habilitacion,

        m.fecha_matricula,
        m.estado AS estado_matricula_formal,
        m.observacion,
        m.id_carrera,

        c.nombre AS carrera_matriculada,

        cm.fecha AS fecha_cita,
        cm.hora_inicio,
        cm.hora_fin,
        cm.estado AS estado_cita,

        CASE
          WHEN
            NULLIF(LTRIM(RTRIM(ISNULL(p.nombre, ''))), '') IS NOT NULL
            AND NULLIF(LTRIM(RTRIM(ISNULL(p.apellido, ''))), '') IS NOT NULL
            AND NULLIF(LTRIM(RTRIM(ISNULL(p.email, ''))), '') IS NOT NULL
            AND NULLIF(LTRIM(RTRIM(ISNULL(p.telefono, ''))), '') IS NOT NULL
            AND m.id_carrera IS NOT NULL
          THEN CAST(1 AS BIT)
          ELSE CAST(0 AS BIT)
        END AS datos_completos

      FROM Aspirante a
      INNER JOIN Persona p
        ON p.id_persona = a.id_persona

      OUTER APPLY (
        SELECT TOP 1
          fm1.numero_fila,
          fm1.habilitado,
          fm1.fecha_habilitacion
        FROM Fila_Matricula fm1
        WHERE fm1.id_aspirante = a.id_aspirante
        ORDER BY fm1.fecha_habilitacion DESC, fm1.id_fila DESC
      ) fm

      OUTER APPLY (
        SELECT TOP 1
          m1.id_matricula,
          m1.id_carrera,
          m1.fecha_matricula,
          m1.estado,
          m1.observacion
        FROM Matricula m1
        WHERE m1.id_aspirante = a.id_aspirante
        ORDER BY m1.id_matricula DESC
      ) m

      OUTER APPLY (
        SELECT TOP 1
          cm1.fecha,
          cm1.hora_inicio,
          cm1.hora_fin,
          cm1.estado
        FROM Cita_Matricula cm1
        WHERE cm1.id_aspirante = a.id_aspirante
        ORDER BY cm1.id_cita DESC
      ) cm

      LEFT JOIN Carrera c
        ON c.id_carrera = m.id_carrera

      WHERE a.id_persona = @id_persona;
    `);
  });

  return resultado.recordset[0] || null;
}

async function habilitarUsoMatricula(idPersona) {
  return ejecutarConsulta(async (request) => {

    // PRIMER QUERY
    request.input('id_persona', idPersona);

    const resultado = await request.query(`
      SELECT id_aspirante
      FROM Aspirante
      WHERE id_persona = @id_persona
    `);

    if (!resultado.recordset.length) {
      throw new Error('No se encontró el aspirante asociado a la persona.');
    }

    const idAspirante = resultado.recordset[0].id_aspirante;

    // 👇 NUEVO REQUEST LIMPIO
    return ejecutarConsulta((req2) => {
      req2.input('id_aspirante', idAspirante);
      return req2.execute('sp_AsignarFila');
    });
  });
}

async function actualizarDatosYEleccion(idPersona, datos) {
  return ejecutarConsulta((request) => {
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
      SELECT @id_aspirante = id_aspirante
      FROM Aspirante
      WHERE id_persona = @id_persona;

      IF @id_aspirante IS NULL
      BEGIN
        THROW 50002, 'No se encontró el aspirante asociado a la persona.', 1;
      END

      INSERT INTO Eleccion_Carrera (id_aspirante, id_carrera, fecha_eleccion)
      VALUES (@id_aspirante, @id_carrera, CAST(GETDATE() AS DATE));

      IF NOT EXISTS (
        SELECT 1
        FROM Matricula
        WHERE id_aspirante = @id_aspirante
      )
      BEGIN
        INSERT INTO Matricula (
          id_aspirante,
          id_carrera,
          fecha_matricula,
          estado,
          observacion
        )
        VALUES (
          @id_aspirante,
          @id_carrera,
          NULL,
          'Pendiente',
          NULL
        );
      END
      ELSE
      BEGIN
        UPDATE Matricula
        SET id_carrera = @id_carrera
        WHERE id_aspirante = @id_aspirante;
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
          fecha_matricula = CASE
            WHEN @estado = 'Matriculado' AND m.fecha_matricula IS NULL THEN GETDATE()
            ELSE m.fecha_matricula
          END,
          observacion = @observacion
      FROM Matricula m
      INNER JOIN Aspirante a
        ON a.id_aspirante = m.id_aspirante
      WHERE a.id_persona = @id_persona;
    `);
  });
}

async function listarCarreras() {
  const resultado = await ejecutarConsulta((request) =>
    request.query(`
      SELECT id_carrera, nombre
      FROM Carrera
      ORDER BY nombre
    `)
  );

  return resultado.recordset;
}

module.exports = {
  obtenerPanelAspirante,
  habilitarUsoMatricula,
  actualizarDatosYEleccion,
  indicarEstadoMatricula,
  listarCarreras
};