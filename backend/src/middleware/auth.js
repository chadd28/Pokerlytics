require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate Supabase JWT tokens
 */
const authenticateUser = async (req, res, next) => {
    try {
      // Get the token from the request headers
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify the JWT token using Supabase JWT secret
      try {
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
        
        // Log the decoded token
        //console.log('Decoded JWT:', decoded);
        
        // Add user data to the request
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          aud: decoded.aud,
          role: decoded.role
        };
        
        // Log the user ID
        //console.log('Extracted user ID:', req.user.id);
        
        next();
      } catch (jwtError) {
        console.error('JWT Verification Error:', jwtError.message);
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      
      return res.status(500).json({ message: 'Authentication error' });
    }
};

module.exports = { authenticateUser };