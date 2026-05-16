import { verifyToken } from './jwt.js';

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email, plan: decoded.plan };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decoded = verifyToken(token);
      req.user = { id: decoded.id, email: decoded.email, plan: decoded.plan };
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

export function requirePlan(plans) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!plans.includes(req.user.plan)) {
      return res.status(403).json({ error: `This feature requires one of these plans: ${plans.join(', ')}` });
    }
    next();
  };
}
