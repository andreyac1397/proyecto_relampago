const servicio = require('../servicios/directorServicio');
const correoServicio = require('../servicios/correoServicio');

async function panel(req, res, next) {
  try {
    const carreras = await servicio.obtenerCarrerasDelDirector(req.session.usuario.id_persona);
    res.render('director/panel', { titulo: 'Panel del director', carreras });
  } catch (error) { next(error); }
}

async function vistaConsulta(req, res, next) {
  try {
    const carreras = await servicio.obtenerCarrerasDelDirector(req.session.usuario.id_persona);
    const idCarrera = req.query.id_carrera || carreras[0]?.id_carrera;
    const resultados = idCarrera ? await servicio.consultarMatriculadosPorCarrera(idCarrera) : [];
    res.render('director/consultar-matriculados-de-su-carrera', {
      titulo: 'Consultar matriculados de su carrera',
      carreras,
      idCarrera,
      resultados
    });
  } catch (error) { next(error); }
}

async function vistaCorreoMasivo(req, res, next) {
  try {
    const carreras = await servicio.obtenerCarrerasDelDirector(req.session.usuario.id_persona);
    const idCarrera = req.query.id_carrera || carreras[0]?.id_carrera;
    const destinatarios = idCarrera ? await servicio.consultarMatriculadosPorCarrera(idCarrera) : [];
    res.render('director/enviar-emails-masivos-por-grupo-seleccionado', {
      titulo: 'Enviar emails masivos por grupo seleccionado',
      carreras,
      idCarrera,
      destinatarios
    });
  } catch (error) { next(error); }
}

async function procesarCorreoMasivo(req, res, next) {
  try {
    const idsPersona = Array.isArray(req.body.ids_persona) ? req.body.ids_persona : [req.body.ids_persona].filter(Boolean);
    await correoServicio.registrarCorreo(req.body.asunto, req.body.mensaje, idsPersona);
    req.flash('mensajeExito', 'El envío masivo fue registrado.');
    res.redirect(`/director/enviar-emails-masivos-por-grupo-seleccionado?id_carrera=${req.body.id_carrera}`);
  } catch (error) { next(error); }
}

module.exports = {
  panel,
  vistaConsulta,
  vistaCorreoMasivo,
  procesarCorreoMasivo
};
