import mongoose from 'mongoose';


const logSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
action: { type: String },
meta: { type: mongoose.Schema.Types.Mixed },
ip: { type: String },
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Log', logSchema);