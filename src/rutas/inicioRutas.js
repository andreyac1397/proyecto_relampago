const express = require('express');
const { mostrarInicio } = require('../controladores/inicioControlador');

const router = express.Router();
router.get('/', mostrarInicio);

module.exports = router;
