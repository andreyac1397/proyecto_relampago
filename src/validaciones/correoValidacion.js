const { body } = require('express-validator');

const reglasCorreo = [
  body('asunto').trim().notEmpty().withMessage('El asunto es obligatorio.'),
  body('mensaje').trim().notEmpty().withMessage('El mensaje es obligatorio.')
];

module.exports = { reglasCorreo };
