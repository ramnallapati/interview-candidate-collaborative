import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import createError from 'http-errors';


const signToken = (user) => {
return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};


export const register = async (req, res, next) => {
try {
const { name, email, password, role } = req.body;
const exists = await User.findOne({ email });
if (exists) throw createError(409, 'Email already registered');
const user = await User.create({ name, email, password, role });
const token = signToken(user);
res.status(201).json({ user: { _id: user._id, id: user._id, name: user.name, email: user.email, role: user.role }, token });
} catch (err) {
next(err);
}
};


export const login = async (req, res, next) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) throw createError(401, 'Invalid credentials');
const isMatch = await user.matchPassword(password);
if (!isMatch) throw createError(401, 'Invalid credentials');
const token = signToken(user);
res.json({ user: { _id: user._id, id: user._id, name: user.name, email: user.email, role: user.role }, token });
} catch (err) {
next(err);
}
};


export const me = async (req, res, next) => {
try {
res.json({ user: req.user });
} catch (err) {
next(err);
}
};