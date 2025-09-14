import File from '../models/File.js';
import createError from 'http-errors';


export const createFile = async (req, res, next) => {
try {
const { projectId, name, language } = req.body;
const newFile = await File.create({ project: projectId, name, language, content: '' });
res.status(201).json(newFile);
} catch (err) {
next(err);
}
};


export const getFilesByProject = async (req, res, next) => {
try {
const { projectId } = req.params;
const files = await File.find({ project: projectId });
res.json(files);
} catch (err) {
next(err);
}
};


export const updateFileContent = async (req, res, next) => {
try {
const { fileId } = req.params;
const { content, authorId } = req.body;
const file = await File.findById(fileId);
if (!file) throw createError(404, 'File not found');
// push version
file.versions.push({ content, author: authorId });
file.content = content;
file.updatedAt = new Date();
await file.save();
res.json(file);
} catch (err) {
next(err);
}
};