const servicio = require('../servicios/encargadoServicio');
const correoServicio = require('../servicios/correoServicio');

async function panel(req, res, next) {
  try {
    const resumen = await servicio.obtenerResumenEncargado();
    res.render('encargado/panel', { titulo: 'Panel del encargado', resumen });
  } catch (error) {
    next(error);
  }
}

async function vistaAsignacion(req, res, next) {
  try {
    const aspirantes = await servicio.listarAspirantesEnFila();

    res.render('encargado/asignacion-y-habilitacion-de-fila-y-matricula', {
      titulo: 'Asignación y habilitación de fila y matrícula',
      aspirantes
    });
  } catch (error) {
    next(error);
  }
}

async function procesarAsignacion(req, res, next) {
  try {
    const { id_aspirante, fecha, hora_inicio, hora_fin } = req.body;

    if (!id_aspirante || !fecha || !hora_inicio || !hora_fin) {
      req.flash('mensajeError', 'Todos los campos son obligatorios.');
      return res.redirect('/encargado/asignacion-y-habilitacion-de-fila-y-matricula');
    }

    await servicio.asignarCita({
      id_aspirante,
      fecha,
      hora_inicio,
      hora_fin,
      id_usuario: req.session.usuario.id_usuario
    });

    req.flash('mensajeExito', 'La cita fue asignada correctamente.');
    res.redirect('/encargado/asignacion-y-habilitacion-de-fila-y-matricula');
  } catch (error) {
    if (error.message.includes('CHK_CitaMatricula_Horas')) {
      req.flash('mensajeError', 'La hora de finalización debe ser mayor que la hora de inicio.');
      return res.redirect('/encargado/asignacion-y-habilitacion-de-fila-y-matricula');
    }

    if (error.message.includes('ya tiene una cita pendiente o asignada')) {
      req.flash('mensajeError', 'El aspirante ya tiene una cita pendiente o asignada.');
      return res.redirect('/encargado/asignacion-y-habilitacion-de-fila-y-matricula');
    }

    next(error);
  }
}

async function vistaCitas(req, res, next) {
  try {
    const citas = await servicio.listarCitasPorCarrera();
    res.render('encargado/ver-listado-de-citas-asignadas-por-carrera', {
      titulo: 'Ver listado de citas asignadas por carrera',
      citas
    });
  } catch (error) {
    next(error);
  }
}

async function vistaConsulta(req, res, next) {
  try {
    const resultados = req.query.texto
      ? await servicio.consultarPorEmailOTelefono(req.query.texto)
      : [];

    res.render('encargado/consultar-matricula-o-correo-por-email-y-telefono', {
      titulo: 'Consultar matrícula o correo por email y teléfono',
      resultados,
      texto: req.query.texto || ''
    });
  } catch (error) {
    next(error);
  }
}

async function vistaFiltro(req, res, next) {
  try {
    const estado = req.query.estado || 'Matriculado';
    const resultados = await servicio.filtrarPorEstado(estado);

    res.render('encargado/filtrar-estudiantes-matriculados-o-no-matriculados', {
      titulo: 'Filtrar estudiantes matriculados o no matriculados',
      resultados,
      estado
    });
  } catch (error) {
    next(error);
  }
}

async function vistaCorreos(req, res, next) {
  try {
    const destinatarios = req.query.estado
      ? await correoServicio.obtenerPersonasPorEstado(req.query.estado)
      : [];

    res.render('encargado/enviar-correos-electronicos', {
      titulo: 'Enviar correos electrónicos',
      destinatarios,
      estado: req.query.estado || ''
    });
  } catch (error) {
    next(error);
  }
}

async function procesarCorreos(req, res, next) {
  try {
    const idsPersona = Array.isArray(req.body.ids_persona)
      ? req.body.ids_persona
      : [req.body.ids_persona].filter(Boolean);

    await correoServicio.registrarCorreo(
      req.body.asunto,
      req.body.mensaje,
      idsPersona
    );

    req.flash('mensajeExito', 'El correo fue registrado correctamente.');
    res.redirect('/encargado/enviar-correos-electronicos');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  panel,
  vistaAsignacion,
  procesarAsignacion,
  vistaCitas,
  vistaConsulta,
  vistaFiltro,
  vistaCorreos,
  procesarCorreos
};