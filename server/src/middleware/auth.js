import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/User.js';


const auth = async (req, res, next) => {
try {
const authHeader = req.headers.authorization;
if (!authHeader) throw createError(401, 'No token provided');
const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id).select('-password');
if (!user) throw createError(401, 'User not found');
req.user = user;
next();
} catch (err) {
next(createError(401, 'Not authorized'));
}
};


export default auth;