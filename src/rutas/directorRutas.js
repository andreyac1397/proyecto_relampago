const express = require('express');
const controlador = require('../controladores/directorControlador');
const { requiereAutenticacion } = require('../middlewares/autenticacionMiddleware');
const { requiereRol } = require('../middlewares/rolMiddleware');
const { manejarValidaciones } = require('../middlewares/validacionMiddleware');
const { reglasCorreo } = require('../validaciones/correoValidacion');

const router = express.Router();
router.use(requiereAutenticacion, requiereRol('Director', 'Administrador'));
router.get('/panel', controlador.panel);
router.get('/consultar-matriculados-de-su-carrera', controlador.vistaConsulta);
router.get('/enviar-emails-masivos-por-grupo-seleccionado', controlador.vistaCorreoMasivo);
router.post('/enviar-emails-masivos-por-grupo-seleccionado', reglasCorreo, manejarValidaciones, controlador.procesarCorreoMasivo);

module.exports = router;
