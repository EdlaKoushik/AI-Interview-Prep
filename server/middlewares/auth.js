import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import jwt from 'jsonwebtoken';

// Clerk middleware for protected routes
export const requireClerkAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => {
    console.error('Clerk Auth Error:', err);
    res.status(401).json({ 
      message: 'Authentication failed',
      error: err.message 
    });
  },
  // Skip session check for development
  skipSessionSync: true,
  // Allow test mode for development
  allowTestMode: true,
  // Debug mode for development
  debug: true
});

// Optional: Middleware to attach user info
export const attachUserInfo = async (req, res, next) => {
  try {
    if (req.auth?.userId) {
      // You can fetch additional user info from your database here if needed
      req.userInfo = {
        userId: req.auth.userId,
        // Add any other user info you need
      };
    }
    next();
  } catch (error) {
    console.error('User Info Error:', error);
    next(error);
  }
};

// JWT middleware for protected routes
export function verifyJWT(req, res, next) {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}
