import Message from '../models/Message.js';


export const getMessages = async (req, res, next) => {
try {
const { projectId } = req.params;
const messages = await Message.find({ project: projectId }).sort({ createdAt: 1 }).populate('sender', 'name email');
res.json(messages);
} catch (err) {
next(err);
}
};