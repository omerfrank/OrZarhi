import express from 'express';
import { getReview, getAllReviews, updateReview, addReview } from '../controllers/review.controller.js';

const router = express.Router();

// Get specific review
router.get('/:id', getReview);

// Get all reviews for a movie (e.g., /api/reviews/movie/12345)
router.get('/movie/:movieId', getAllReviews);

// Update review
router.put('/:id', updateReview);

router.post('/', addReview);

export default router;