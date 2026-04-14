function configurarVariablesGlobales(req, res, next) {
  res.locals.usuario = req.session.usuario || null;
  res.locals.rutaActual = req.path;
  res.locals.mensajeExito = req.flash('mensajeExito');
  res.locals.mensajeError = req.flash('mensajeError');
  res.locals.errores = req.flash('errores');
  next();
}

module.exports = { configurarVariablesGlobales };
