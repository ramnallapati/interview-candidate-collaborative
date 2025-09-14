import mongoose from 'mongoose';


const versionSchema = new mongoose.Schema({
content: String,
createdAt: { type: Date, default: Date.now },
author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


const fileSchema = new mongoose.Schema({
project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
name: { type: String, required: true },
language: { type: String, default: 'javascript' },
content: { type: String, default: '' },
versions: [versionSchema],
updatedAt: { type: Date, default: Date.now }
});


export default mongoose.model('File', fileSchema);