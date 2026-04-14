const servicio = require('../servicios/aspiranteServicio');

async function panel(req, res, next) {
  try {
    const resumen = await servicio.obtenerPanelAspirante(req.session.usuario.id_persona);
    res.render('aspirante/panel', { titulo: 'Panel del aspirante', resumen });
  } catch (error) {
    next(error);
  }
}

async function vistaHabilitar(req, res, next) {
  try {
    const resumen = await servicio.obtenerPanelAspirante(req.session.usuario.id_persona);
    res.render('aspirante/habilitar-uso-matricula', { titulo: 'Habilitar uso de matrícula', resumen });
  } catch (error) { next(error); }
}

async function procesarHabilitar(req, res, next) {
  try {
    await servicio.habilitarUsoMatricula(req.session.usuario.id_persona);
    req.flash('mensajeExito', 'Se habilitó el uso de matrícula correctamente.');
    res.redirect('/aspirante/habilitar-uso-matricula');
  } catch (error) { next(error); }
}

async function vistaCompletar(req, res, next) {
  try {
    const carreras = await servicio.listarCarreras();
    res.render('aspirante/completar-datos-personales-carrera', { titulo: 'Completar datos personales y carrera elegida', carreras });
  } catch (error) { next(error); }
}

async function procesarCompletar(req, res, next) {
  try {
    await servicio.actualizarDatosYEleccion(req.session.usuario.id_persona, req.body);
    req.flash('mensajeExito', 'Tus datos y tu carrera fueron actualizados.');
    res.redirect('/aspirante/completar-datos-personales-carrera');
  } catch (error) { next(error); }
}

function vistaIndicar(req, res) {
  res.render('aspirante/indicar-si-matriculo-o-no', { titulo: 'Indicar si matriculó o no' });
}

async function procesarIndicar(req, res, next) {
  try {
    await servicio.indicarEstadoMatricula(req.session.usuario.id_persona, req.body.estado, req.body.observacion);
    req.flash('mensajeExito', 'Se actualizó tu estado de matrícula.');
    res.redirect('/aspirante/indicar-si-matriculo-o-no');
  } catch (error) { next(error); }
}

module.exports = {
  panel,
  vistaHabilitar,
  procesarHabilitar,
  vistaCompletar,
  procesarCompletar,
  vistaIndicar,
  procesarIndicar
};
