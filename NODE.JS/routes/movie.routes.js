import express from 'express';
import { addMovie, getMovie, getAllMovies } from '../controllers/movie.controller.js';

const router = express.Router();

// GET /api/movies - Get all movies (supports ?genre=Action)
router.get('/', getAllMovies);

// GET /api/movies/:id - Get a specific movie by ID
router.get('/:id', getMovie);

// POST /api/movies - Add a new movie
router.post('/', addMovie);

export default router;