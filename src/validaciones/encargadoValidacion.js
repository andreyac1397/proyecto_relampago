const { body } = require('express-validator');

const reglasAsignacion = [
  body('id_aspirante').isInt({ min: 1 }).withMessage('Selecciona un aspirante.'),
  body('numero_fila').isInt({ min: 1 }).withMessage('El número de fila debe ser válido.'),
  body('id_carrera').isInt({ min: 1 }).withMessage('Selecciona una carrera válida.')
];

module.exports = { reglasAsignacion };
