function errorHandler(err, req, res, next) {
  console.error('❌ Error en la solicitud:', err);
  const status = err.status || 500;
  res.status(status).json({ status: 'error', message: err.message || 'Error interno del servidor' });
}

module.exports = errorHandler;
