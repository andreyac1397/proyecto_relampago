function requiereRol(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.session.usuario;
    if (!usuario) {
      req.flash('mensajeError', 'Debes iniciar sesión.');
      return res.redirect('/auth/login');
    }
    if (!rolesPermitidos.includes(usuario.rol)) {
      req.flash('mensajeError', 'No tienes permiso para entrar a esta sección.');
      return res.redirect('/');
    }
    next();
  };
}

module.exports = { requiereRol };
