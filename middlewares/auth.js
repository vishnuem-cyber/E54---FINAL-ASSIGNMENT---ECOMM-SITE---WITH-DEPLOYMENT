const jwt = require('jsonwebtoken');

// Fetch the secret key from the environment variables (ensure it's set in .env)
const secret_key = process.env.JWT_SECRET_KEY || 'secret123';  // Use fallback in case it's not defined

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];  // Extract the token from "Bearer <token>"
  
  // If there's no token, respond with an Unauthorized error
  if (!token) return res.sendStatus(401);  // 401: Unauthorized

  // Verify the token with the secret key
  jwt.verify(token, secret_key, (err, user) => {
    // If there's an error while verifying the token, send a Forbidden error
    if (err) return res.status(403).json({ error: "Invalid token" });  // 403: Forbidden

    // Attach the user information to the request object for later use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = authenticateToken;
