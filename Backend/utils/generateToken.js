const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    // This tells the browser to only send the cookie over HTTPS.
    // It is essential for cross-domain cookies.
    secure: process.env.NODE_ENV !== 'development', 
    
    // This allows the cookie to be sent from your frontend domain
    // to your backend domain on Render.
    sameSite: 'none', 
    
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

module.exports = generateToken;
