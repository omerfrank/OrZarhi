import Cast from '../models/cast.js';
import Movie from '../models/movie.js';
import { z } from 'zod';

const castValidation = z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().min(1, "Bio is required"),
    role: z.string().min(1, "Role is required"),
    photoURL: z.string().optional(),
    birthDay: z.string().or(z.date()).transform((val) => newDGate(val)), // Basic date transform
});

export async function getCastById(req, res) {
    try {
        const { id } = req.params;
        const castMember = await Cast.findById(id);

        if (!castMember) {
            return res.status(404).json({ success: false, error: 'Cast member not found' });
        }

        return res.status(200).json({ success: true, data: castMember });
    } catch (error) {
        console.error("Error fetching cast:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export async function getCastByMovieId(req, res) {
    try {
        const { id } = req.params; // Movie ID

        const movie = await Movie.findById(id).populate('cast');

        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }

        return res.status(200).json({ success: true, data: movie.cast });
    } catch (error) {
        console.error("Error fetching movie cast:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
export async function getAllCast(req, res) {
    try {
        const { name } = req.query;
        const filter = {};
        
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        const cast = await Cast.find(filter).sort({ name: 1 });
        return res.status(200).json({ success: true, count: cast.length, data: cast });
    } catch (error) {
        console.error("Error fetching all cast:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
export async function createCast(req, res) {
    try {

        const { name, bio, role, photoURL, birthDay } = req.body;

        const newCast = await Cast.create({
            name,
            bio,
            role,
            photoURL,
            birthDay
        });

        return res.status(201).json({ success: true, message: 'Cast member created', data: newCast });
    } catch (error) {
        console.error("Error creating cast:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
export async function deleteCast(req, res) {
    try {
        const { id } = req.params;

        // Find and delete the cast member
        const deletedCast = await Cast.findByIdAndDelete(id);

        // Handle case where cast member doesn't exist
        if (!deletedCast) {
            return res.status(404).json({ success: false, error: 'Cast member not found' });
        }

        // Remove this cast member from all movies
        await Movie.updateMany(
            { cast: id },
            { $pull: { cast: id } }
        );

        return res.status(200).json({ success: true, message: 'Cast member deleted successfully' });

    } catch (error) {
        console.error("Error deleting cast:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}