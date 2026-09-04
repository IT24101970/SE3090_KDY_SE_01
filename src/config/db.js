import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        let connStr = process.env.MONGO_URL || process.env.MONGO_URI;
        if (!connStr) {
            throw new Error('Neither MONGO_URL nor MONGO_URI is set in environment variables');
        }

        // Auto-encode '@' in password if present in unencoded form
        if (connStr.includes('@')) {
            const parts = connStr.split('@');
            if (parts.length > 2) {
                const auth = parts.slice(0, parts.length - 1).join('%40');
                connStr = `${auth}@${parts[parts.length - 1]}`;
            }
        }

        await mongoose.connect(connStr);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;