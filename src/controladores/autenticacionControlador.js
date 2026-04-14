const bcrypt = require('bcryptjs');
const { buscarUsuarioPorCredenciales } = require('../servicios/autenticacionServicio');

function mostrarLogin(req, res) {
  res.render('autenticacion/login', { titulo: 'Iniciar sesión' });
}

async function iniciarSesion(req, res, next) {
  try {
    const { nombre_usuario, clave } = req.body;
    const usuario = await buscarUsuarioPorCredenciales(nombre_usuario);

    if (!usuario) {
      req.flash('mensajeError', 'Usuario no encontrado.');
      return res.redirect('/auth/login');
    }

    if (usuario.estado !== 'Activo') {
      req.flash('mensajeError', 'Tu usuario está inactivo.');
      return res.redirect('/auth/login');
    }

    let credencialValida = false;

    if (usuario.clave.startsWith('$2a$') || usuario.clave.startsWith('$2b$')) {
      credencialValida = await bcrypt.compare(clave, usuario.clave);
    } else {
      credencialValida = usuario.clave === clave;
    }

    if (!credencialValida) {
      req.flash('mensajeError', 'La contraseña no es correcta.');
      return res.redirect('/auth/login');
    }

    req.session.usuario = {
      id_usuario: usuario.id_usuario,
      id_persona: usuario.id_persona,
      nombre_usuario: usuario.nombre_usuario,
      nombre_completo: `${usuario.nombre} ${usuario.apellido}`,
      email: usuario.email,
      rol: usuario.rol
    };

    req.flash('mensajeExito', `Bienvenido, ${usuario.nombre}.`);

    if (usuario.rol === 'Aspirante') return res.redirect('/aspirante/panel');
    if (usuario.rol === 'Encargado') return res.redirect('/encargado/panel');
    if (usuario.rol === 'Director') return res.redirect('/director/panel');

    return res.redirect('/');
  } catch (error) {
    next(error);
  }
}

function cerrarSesion(req, res) {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
}

module.exports = { mostrarLogin, iniciarSesion, cerrarSesion };
