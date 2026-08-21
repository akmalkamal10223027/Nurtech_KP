const errorHandler = (err, req, res, next) => {
  console.error('[Error caught in Middleware]:', err);
  const status = err.status || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  res.status(status).json({
    error: {
      status,
      name: err.name || 'InternalServerError',
      message
    }
  });
};

module.exports = errorHandler;
