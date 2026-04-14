const express = require('express');
const controlador = require('../controladores/autenticacionControlador');
const { reglasLogin } = require('../validaciones/autenticacionValidacion');
const { manejarValidaciones } = require('../middlewares/validacionMiddleware');

const router = express.Router();
router.get('/login', controlador.mostrarLogin);
router.post('/login', reglasLogin, manejarValidaciones, controlador.iniciarSesion);
router.post('/logout', controlador.cerrarSesion);

module.exports = router;
