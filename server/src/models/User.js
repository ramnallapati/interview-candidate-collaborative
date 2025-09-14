import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: { type: String, enum: ['interviewer', 'candidate'], default: 'candidate' },
createdAt: { type: Date, default: Date.now }
});


userSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS || 10));
this.password = await bcrypt.hash(this.password, salt);
next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
return await bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model('User', userSchema);