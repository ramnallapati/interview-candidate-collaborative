import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const connectDB = async () => {
try {
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set in .env');
await mongoose.connect(process.env.MONGODB_URI, {
useNewUrlParser: true,
 useUnifiedTopology: true
});
console.log('MongoDB connected');
} catch (err) {
console.error('MongoDB connection error:', err.message);
process.exit(1);
}
};


export default connectDB;