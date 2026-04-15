const express = require('express');
const controlador = require('../controladores/aspiranteControlador');
const { requiereAutenticacion } = require('../middlewares/autenticacionMiddleware');
const { requiereRol } = require('../middlewares/rolMiddleware');
const { manejarValidaciones } = require('../middlewares/validacionMiddleware');
const { reglasCompletarDatos } = require('../validaciones/aspiranteValidacion');

const router = express.Router();

router.use(requiereAutenticacion, requiereRol('Aspirante'));

router.get('/panel', controlador.panel);
router.get('/habilitar-uso-matricula', controlador.vistaHabilitar);
router.post('/habilitar-uso-matricula', controlador.procesarHabilitar);

router.get('/completar-datos-personales-carrera', controlador.vistaCompletar);
router.post(
  '/completar-datos-personales-carrera',
  reglasCompletarDatos,
  manejarValidaciones,
  controlador.procesarCompletar
);

module.exports = router;