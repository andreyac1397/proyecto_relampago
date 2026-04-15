const { validationResult } = require('express-validator');

function manejarValidaciones(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash('mensajeError', 'Revisa los campos del formulario.');
    req.flash('errores', errores.array());

    return res.redirect(req.originalUrl);
  }

  next();
}

module.exports = {
  manejarValidaciones
};