import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_default';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'jwt_refresh_secret_default';

export function generateTokens(payload: object) {

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};