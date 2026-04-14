const { body } = require('express-validator');

const reglasCompletarDatos = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio.'),
  body('email').isEmail().withMessage('El correo no es válido.'),
  body('telefono').trim().notEmpty().withMessage('El teléfono es obligatorio.'),
  body('id_carrera').isInt({ min: 1 }).withMessage('Selecciona una carrera válida.')
];

const reglasEstadoMatricula = [
  body('estado').isIn(['Matriculado', 'No matriculado', 'Pendiente']).withMessage('El estado es inválido.')
];

module.exports = { reglasCompletarDatos, reglasEstadoMatricula };
