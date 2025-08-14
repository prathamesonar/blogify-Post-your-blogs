import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    // ✅ This is the critical change.
    // 'secure' must be true for sameSite='none' to work.
    // This tells the browser to only send the cookie over HTTPS.
    secure: process.env.NODE_ENV !== 'development', 
    
    // ✅ This allows the cookie to be sent from your frontend domain
    // to your backend domain.
    sameSite: 'none', 
    
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
