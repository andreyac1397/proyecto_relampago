const servicio = require('../servicios/encargadoServicio');
const correoServicio = require('../servicios/correoServicio');

async function panel(req, res, next) {
  try {
    const resumen = await servicio.obtenerResumenEncargado();
    res.render('encargado/panel', { titulo: 'Panel del encargado', resumen });
  } catch (error) { next(error); }
}

async function vistaAsignacion(req, res, next) {
  try {
    const aspirantes = await servicio.listarAspirantes();
    const carreras = await servicio.listarCarreras();
    res.render('encargado/asignacion-y-habilitacion-de-fila-y-matricula', {
      titulo: 'Asignación y habilitación de fila y matrícula',
      aspirantes,
      carreras
    });
  } catch (error) { next(error); }
}

async function procesarAsignacion(req, res, next) {
  try {
    await servicio.asignarFilaYMatricula(req.body);
    req.flash('mensajeExito', 'Fila y matrícula asignadas correctamente.');
    res.redirect('/encargado/asignacion-y-habilitacion-de-fila-y-matricula');
  } catch (error) { next(error); }
}

async function vistaCitas(req, res, next) {
  try {
    const citas = await servicio.listarCitasPorCarrera();
    res.render('encargado/ver-listado-de-citas-asignadas-por-carrera', { titulo: 'Ver listado de citas asignadas por carrera', citas });
  } catch (error) { next(error); }
}

async function vistaConsulta(req, res, next) {
  try {
    const resultados = req.query.texto ? await servicio.consultarPorEmailOTelefono(req.query.texto) : [];
    res.render('encargado/consultar-matricula-o-correo-por-email-y-telefono', { titulo: 'Consultar matrícula o correo por email y teléfono', resultados, texto: req.query.texto || '' });
  } catch (error) { next(error); }
}

async function vistaFiltro(req, res, next) {
  try {
    const estado = req.query.estado || 'Matriculado';
    const resultados = await servicio.filtrarPorEstado(estado);
    res.render('encargado/filtrar-estudiantes-matriculados-o-no-matriculados', { titulo: 'Filtrar estudiantes matriculados o no matriculados', resultados, estado });
  } catch (error) { next(error); }
}

async function vistaCorreos(req, res, next) {
  try {
    const destinatarios = req.query.estado ? await correoServicio.obtenerPersonasPorEstado(req.query.estado) : [];
    res.render('encargado/enviar-correos-electronicos', {
      titulo: 'Enviar correos electrónicos',
      destinatarios,
      estado: req.query.estado || ''
    });
  } catch (error) { next(error); }
}

async function procesarCorreos(req, res, next) {
  try {
    const idsPersona = Array.isArray(req.body.ids_persona) ? req.body.ids_persona : [req.body.ids_persona].filter(Boolean);
    await correoServicio.registrarCorreo(req.body.asunto, req.body.mensaje, idsPersona);
    req.flash('mensajeExito', 'El correo fue registrado correctamente.');
    res.redirect('/encargado/enviar-correos-electronicos');
  } catch (error) { next(error); }
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
