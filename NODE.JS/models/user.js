import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastSeen: {
        type: Date
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movies'
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);