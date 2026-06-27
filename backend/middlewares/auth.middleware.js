import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.iris_token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isVerified) return res.status(401).json({ error: 'Not authorized' });

    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
