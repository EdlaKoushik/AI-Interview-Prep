import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// Middleware to require authentication
export const requireAuth = ClerkExpressWithAuth({
  // Optional: Configure any Clerk options here
  onError: (err, req, res, next) => {
    console.error('Clerk Auth Error:', err);
    res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }
});

// Optional: Middleware to attach user to request if authenticated
export const optionalAuth = ClerkExpressWithAuth({
  optional: true,
  onError: (err, req, res, next) => {
    console.error('Clerk Auth Error:', err);
    next(); // Continue without auth
  }
}); 