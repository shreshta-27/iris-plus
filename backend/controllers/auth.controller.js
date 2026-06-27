import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { sendOTPEmail } from '../config/mailer.js';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

function setTokenCookie(res, token) {
  res.cookie('iris_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    try {
      await sendOTPEmail(email, name, otp);
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    return res.status(201).json({
      message: 'Registration successful. Check your email for the OTP.',
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyOTP(req, res, next) {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'Already verified' });
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date() > user.otpExpiry) return res.status(400).json({ error: 'OTP expired. Request a new one.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = createToken(user._id);
    setTokenCookie(res, token);

    return res.json({
      message: 'Email verified successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

export async function resendOTP(req, res, next) {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user || user.isVerified) return res.status(400).json({ error: 'Invalid request' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOTPEmail(user.email, user.name, otp);
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    return res.json({ message: 'OTP resent successfully' });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ error: 'Email not verified', userId: user._id });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken(user._id);
    setTokenCookie(res, token);

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.clearCookie('iris_token');
  return res.json({ message: 'Logged out successfully' });
}

export async function getMe(req, res) {
  return res.json({ user: req.user });
}
