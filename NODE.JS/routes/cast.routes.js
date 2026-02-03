import express from 'express';
import { reqLogin, reqAdmin } from '../middleware/middleware.auth.js';
import { getCastById, getCastByMovieId, createCast } from '../controllers/cast.controller.js';

const router = express.Router();

// Get specific cast member details
router.get('/:id', reqLogin, getCastById);

// Get all cast members for a specific movie
router.get('/movie/:id', reqLogin, getCastByMovieId);

// Add a new cast member
router.post('/', reqAdmin, createCast);

export default router;