import express from 'express';
import { reqLogin, reqAdmin } from '../middleware/middleware.auth.js';
import { getReview, getAllReviews, updateReview, addReview, deleteReview } from '../controllers/review.controller.js';

const router = express.Router();

// Get specific review
router.get('/:id', reqLogin, getReview);

// Get all reviews for a movie (e.g., /api/reviews/movie/12345)
router.get('/movie/:movieId', reqLogin, getAllReviews);

// Update review
router.put('/:id', reqLogin, updateReview);

// add
router.post('/', reqLogin, addReview);

// deel
router.delete('/:id', reqLogin, deleteReview);

export default router;