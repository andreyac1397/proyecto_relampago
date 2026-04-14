const { validationResult } = require('express-validator');

function manejarValidaciones(req, res, next) {
  const errores = validationResult(req);
  if (errores.isEmpty()) return next();

  req.flash('errores', errores.array());
  req.flash('mensajeError', 'Revisa los campos del formulario.');
  req.flash('datosFormulario', req.body);
  return res.redirect('back');
}

module.exports = { manejarValidaciones };
