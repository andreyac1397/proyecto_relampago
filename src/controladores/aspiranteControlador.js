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
    res.render('aspirante/habilitar-uso-matricula', {
      titulo: 'Habilitar uso de matrícula',
      resumen
    });
  } catch (error) {
    next(error);
  }
}

async function procesarHabilitar(req, res, next) {
  try {
    const resumen = await servicio.obtenerPanelAspirante(req.session.usuario.id_persona);

    if (!resumen?.datos_completos) {
      req.flash('mensajeError', 'Debes completar tus datos personales antes de solicitar la cita.');
      return res.redirect('/aspirante/habilitar-uso-matricula');
    }

    if (resumen?.habilitado) {
      req.flash('mensajeError', 'Ya solicitaste tu cita de matrícula.');
      return res.redirect('/aspirante/habilitar-uso-matricula');
    }

    await servicio.habilitarUsoMatricula(req.session.usuario.id_persona);

    req.flash('mensajeExito', 'Se solicitó la cita de matrícula correctamente.');
    res.redirect('/aspirante/habilitar-uso-matricula');
  } catch (error) {
    next(error);
  }
}
async function vistaCompletar(req, res, next) {
  try {
    const carreras = await servicio.listarCarreras();
    res.render('aspirante/completar-datos-personales-carrera', {
      titulo: 'Completar datos personales y carrera elegida',
      carreras
    });
  } catch (error) {
    next(error);
  }
}

async function procesarCompletar(req, res, next) {
  try {
    await servicio.actualizarDatosYEleccion(
      req.session.usuario.id_persona,
      req.body
    );

    req.flash(
      'mensajeExito',
      'Datos guardados correctamente. Ahora puedes continuar con el proceso de matrícula.'
    );

    // 🔥 CAMBIO IMPORTANTE: redirige al siguiente paso
    res.redirect('/aspirante/habilitar-uso-matricula');

  } catch (error) {
    next(error);
  }
}

function vistaIndicar(req, res) {
  res.render('aspirante/indicar-si-matriculo-o-no', {
    titulo: 'Indicar si matriculó o no'
  });
}

async function procesarIndicar(req, res, next) {
  try {
    await servicio.indicarEstadoMatricula(
      req.session.usuario.id_persona,
      req.body.estado,
      req.body.observacion
    );

    req.flash('mensajeExito', 'Se actualizó tu estado de matrícula.');

    res.redirect('/aspirante/indicar-si-matriculo-o-no');

  } catch (error) {
    next(error);
  }
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