const { body } = require('express-validator');

const reglasAsignacion = [
  body('id_aspirante')
    .notEmpty().withMessage('Debes seleccionar un aspirante.')
    .isInt().withMessage('El aspirante debe ser válido.'),

  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .isDate().withMessage('La fecha debe ser válida.'),

  body('hora_inicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria.'),

  body('hora_fin')
    .notEmpty().withMessage('La hora de finalización es obligatoria.')
    .custom((horaFin, { req }) => {
      const horaInicio = req.body.hora_inicio;

      if (!horaInicio || !horaFin) {
        return true;
      }

      if (horaFin <= horaInicio) {
        throw new Error('La hora de finalización debe ser mayor que la hora de inicio.');
      }

      return true;
    })
];

module.exports = {
  reglasAsignacion
};