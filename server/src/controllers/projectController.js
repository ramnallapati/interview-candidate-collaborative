import Project from '../models/Project.js';
import createError from 'http-errors';


export const createProject = async (req, res, next) => {
try {
const { name, members } = req.body;
const project = await Project.create({ name, owner: req.user._id, members: members || [] });
res.status(201).json(project);
} catch (err) {
next(err);
}
};


export const getProjectsForUser = async (req, res, next) => {
try {
const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] });
res.json(projects);
} catch (err) {
next(err);
}
};