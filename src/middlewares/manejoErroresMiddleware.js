module.exports = (error, req, res, next) => {
  console.error(error);
  res.status(500).render('errores/500', {
    titulo: 'Error interno',
    detalle: error.message || 'Ha ocurrido un error inesperado.'
  });
};
