const { body } = require('express-validator');

const reglasLogin = [
  body('nombre_usuario').trim().notEmpty().withMessage('El usuario es obligatorio.'),
  body('clave').trim().notEmpty().withMessage('La contraseña es obligatoria.')
];

module.exports = { reglasLogin };
