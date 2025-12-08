import mongoose from "mongoose";
const castSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    photoURL: {
        type: String,
    },
    birthDay:{
        type: Date,
        required: true,
    },
},{timestamps: true});

export default mongoose.model('Cast',castSchema);