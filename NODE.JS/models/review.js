import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({

    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    movieID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movies',
        required: true
    },
    rating: {
        type: Number, 
        required: true,
        min: [1,"cant be soo bad"],
        max: [10, "cant be better than The Matrix, and it is 10/10"],
    },
    text:{
        type: String,
        required: false,
        trim: true,

    },
    title:{
        type: String,
        required: true,
        trim: true,

    },
    updatedAt:{
        type: Date
    }

},{timestamps: true});

export default mongoose.model('Review',reviewSchema);