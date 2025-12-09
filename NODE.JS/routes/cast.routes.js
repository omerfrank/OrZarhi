import express from 'express';
import { getCastById, getCastByMovieId, createCast } from '../controllers/cast.controller.js';

const router = express.Router();

// Get specific cast member details
router.get('/:id', getCastById);

// Get all cast members for a specific movie
router.get('/movie/:id', getCastByMovieId);

// Add a new cast member
router.post('/', createCast);

export default router;