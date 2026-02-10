import Review from '../models/review.js';
import User from '../models/user.js';

// Create a new review: POST /api/reviews/
export async function addReview(req, res) {
    try {
        const { movieID, rating, text, title } = req.body;
        
        // Use userID from session (preferred) or request body
        const userID = req.session?.userId || req.body.userID;

        if (!userID || !movieID || !rating || !title) {
            return res.status(400).json({ 
                success: false, 
                error: "UserID, MovieID, rating, and title are required"
            });
        }

        const newReview = await Review.create({
            userID,
            movieID,
            rating,
            text,
            title
        });

        return res.status(201).json({ success: true, data: newReview });
    } catch (error) {
        console.error("Add review error:", error);
        // Handle Mongoose validation errors (like rating limits)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages[0] });
        }
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// Get a specific review by ID: GET /api/reviews/:id
export async function getReview(req, res) {
    try {
        const { id } = req.params;
        const review = await Review.findById(id).populate('userID', 'username');
        
        if (!review) {
            return res.status(404).json({ success: false, error: "Review not found" });
        }

        return res.status(200).json({ success: true, data: review });
    } catch (error) {
        console.error("Get review error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// Get all reviews for a specific movie: GET /api/reviews/movie/:movieId
export async function getAllReviews(req, res) {
    try {
        const { movieId } = req.params;
        
        // Find all reviews matching the movieID and show reviewer usernames
        const reviews = await Review.find({ movieID: movieId })
            .populate('userID', 'username')
            .sort({ createdAt: -1 }); // Newest first

        return res.status(200).json({ 
            success: true, 
            count: reviews.length, 
            data: reviews 
        });
    } catch (error) {
        console.error("Get all reviews error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// Update an existing review: PUT /api/reviews/:id
export async function updateReview(req, res) {
    try {
        const { id } = req.params;
        const { rating, text, title } = req.body;
        const userId = req.session?.userId;

        // Check if the review exists and belongs to the user
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, error: "Review not found" });
        }

        // Optional: Security check to ensure only the owner can update
        if (userId && review.userID.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Unauthorized to update this review" });
        }

        // Apply updates
        if (rating) review.rating = rating;
        if (text) review.text = text;
        if (title) review.title = title;
        review.updatedAt = Date.now();

        await review.save();

        return res.status(200).json({ success: true, message: "Review updated", data: review });
    } catch (error) {
        console.error("Update review error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, error: error.message });
        }
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// Delete a review: DELETE /api/reviews/:id
export async function deleteReview(req, res) {
    try {
        const { id } = req.params;
        const userId = req.session?.userId;

        if (!userId) {
             return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        // Fetch review and user in parallel
        const [review, requestingUser] = await Promise.all([
            Review.findById(id),
            User.findById(userId)
        ]);

        if (!review) {
            return res.status(404).json({ success: false, error: "Review not found" });
        }

        // Security check: Ensure owner OR admin
        const isOwner = review.userID.toString() === userId;
        const isAdmin = requestingUser && requestingUser.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, error: "Unauthorized to delete this review" });
        }

        // Delete the review
        await Review.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Review deleted successfully" });

    } catch (error) {
        console.error("Delete review error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}