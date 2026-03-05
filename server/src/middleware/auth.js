const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../controllers/authController');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('[Auth] No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('[Auth] Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next();

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (!err) {
        req.user = user;
    }
    next();
  });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log('[Auth] Admin access denied. User role:', req.user?.role);
        res.status(403).json({ error: 'Admin access required' });
    }
};

module.exports = { authenticateToken, isAdmin, optionalAuth };