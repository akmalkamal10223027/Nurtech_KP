const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        status: 401,
        name: 'UnauthorizedError',
        message: 'Akses ditolak. Token otentikasi tidak ditemukan.'
      }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nurtech_school_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: {
        status: 401,
        name: 'UnauthorizedError',
        message: 'Token tidak valid atau telah kedaluwarsa.'
      }
    });
  }
};

module.exports = authMiddleware;
