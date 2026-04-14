const express = require('express');
const controlador = require('../controladores/encargadoControlador');
const { requiereAutenticacion } = require('../middlewares/autenticacionMiddleware');
const { requiereRol } = require('../middlewares/rolMiddleware');
const { manejarValidaciones } = require('../middlewares/validacionMiddleware');
const { reglasAsignacion } = require('../validaciones/encargadoValidacion');
const { reglasCorreo } = require('../validaciones/correoValidacion');

const router = express.Router();
router.use(requiereAutenticacion, requiereRol('Encargado', 'Administrador'));
router.get('/panel', controlador.panel);
router.get('/asignacion-y-habilitacion-de-fila-y-matricula', controlador.vistaAsignacion);
router.post('/asignacion-y-habilitacion-de-fila-y-matricula', reglasAsignacion, manejarValidaciones, controlador.procesarAsignacion);
router.get('/ver-listado-de-citas-asignadas-por-carrera', controlador.vistaCitas);
router.get('/consultar-matricula-o-correo-por-email-y-telefono', controlador.vistaConsulta);
router.get('/filtrar-estudiantes-matriculados-o-no-matriculados', controlador.vistaFiltro);
router.get('/enviar-correos-electronicos', controlador.vistaCorreos);
router.post('/enviar-correos-electronicos', reglasCorreo, manejarValidaciones, controlador.procesarCorreos);

module.exports = router;
