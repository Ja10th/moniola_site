const jwt = require('jsonwebtoken');

const isAdminRole = (role) => ['admin', 'principal', 'vice_principal'].includes(role);
const isTeacherRole = (role) => ['teacher', 'class_teacher'].includes(role);

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!isAdminRole(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied. Principal/Administrator only.' });
  }
  next();
};

const teacherOrAdmin = (req, res, next) => {
  if (!isTeacherRole(req.user.role) && !isAdminRole(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly, teacherOrAdmin };
