function mostrarInicio(req, res) {
  res.render('inicio/index', { titulo: 'Inicio' });
}

module.exports = { mostrarInicio };
