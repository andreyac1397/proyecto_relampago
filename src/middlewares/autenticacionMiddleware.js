function requiereAutenticacion(req, res, next) {
  if (!req.session.usuario) {
    req.flash('mensajeError', 'Debes iniciar sesión para continuar.');
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = { requiereAutenticacion };
