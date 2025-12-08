import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: false,
        trim: true,

    },
    genre: {
        type: [String], 
        required: true,
    },
    releaseDate: {
        type: Date, 
        required: true,
    },
    posterURL: {
        type: String, 
        required: true,
    },
    cast: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Cast',
        required: true
    },

},{timestamps: true});

export default mongoose.model('Movies',movieSchema);