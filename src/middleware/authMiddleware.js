// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   try {
//     // Extract token from the 'Authorization' header
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) {
//       return res
//         .status(401)
//         .json({ message: 'Access denied. No token provided.' });
//     }

//     // The header should be in the format: 'Bearer <token>'
//     const token = authHeader.split(' ')[1];
//     // console.log('Extracted token:', token);

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: 'Access denied. No token provided.' });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded token data:', decoded);

//     req.user = decoded; // Attach decoded data (e.g., userId) to the request

//     next(); // Move to the next middleware or route handler
//   } catch (error) {
//     console.log('Token verification error:', error);
//     return res.status(400).json({ message: 'Invalid token' });
//   }
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Make sure this line sets `req.user`
    next();
  } catch (error) {
    console.error('Token is not valid:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
