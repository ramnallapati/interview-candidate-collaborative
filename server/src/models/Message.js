import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
room: { type: String },
sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
text: { type: String },
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Message', messageSchema);