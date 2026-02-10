import Movie from '../models/movie.js';
import { VaddMovie } from '../validations/movie.schema.js';
import Review from '../models/review.js';
export async function addMovie(req, res) {
    try {
        // Validate Input
        const parsed = VaddMovie.safeParse(req.body);
        if (!parsed.success) {
            const issues = parsed.error.issues || [];
            const errorMsg = issues[0]?.message || 'Validation failed';
            return res.status(400).json({ success: false, error: errorMsg });
        }

        // Create Movie
        // The cast array should contain IDs of existing cast members
        const movie = await Movie.create(parsed.data);

        return res.status(201).json({ success: true, message: 'Movie added successfully', data: movie });

    } catch (error) {
        console.error('Add Movie Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export async function getMovie(req, res) {
    try {
        const { id } = req.params;
        // .populate('cast') replaces the cast IDs with the actual Cast objects
        const movie = await Movie.findById(id).populate('cast');

        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }

        return res.status(200).json({ success: true, data: movie });

    } catch (error) {
        console.error('Get Movie Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export async function getAllMovies(req, res) {
    try {
        // Basic filtering example: ?genre=Action
        const { genre } = req.query;
        const filter = {};
        
        if (genre) {
            filter.genre = genre;
        }

        // Fetch all movies matching the filter
        const movies = await Movie.find(filter).populate('cast');

        return res.status(200).json({ success: true, count: movies.length, data: movies });

    } catch (error) {
        console.error('Get All Movies Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
export async function deleteMovie(req, res) {
    try {
        const { id } = req.params;

        // Find and delete the movie
        const deletedMovie = await Movie.findByIdAndDelete(id);

        // Handle case where movie doesn't exist
        if (!deletedMovie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }

        // Clean up related data: Delete all reviews associated with this movie
        await Review.deleteMany({ movieID: id });

        return res.status(200).json({ 
            success: true, 
            message: 'Movie and associated reviews deleted successfully' 
        });

    } catch (error) {
        console.error('Delete Movie Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
export async function addCastToMovie(req, res) {
    try {
        const { id } = req.params; // Movie ID
        const { castId } = req.body; // Cast Member ID

        if (!castId) {
            return res.status(400).json({ success: false, error: 'Cast ID is required' });
        }

        // Use $addToSet to prevent duplicate entries of the same actor
        const movie = await Movie.findByIdAndUpdate(
            id,
            { $addToSet: { cast: castId } },
            { new: true }
        ).populate('cast');

        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }

        return res.status(200).json({ success: true, message: 'Cast linked to movie', data: movie });

    } catch (error) {
        console.error('Link Cast Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}