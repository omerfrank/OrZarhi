import express from 'express';
import { reqLogin, reqAdmin } from '../middleware/middleware.auth.js';
import { addMovie, getMovie, getAllMovies, deleteMovie, addCastToMovie } from '../controllers/movie.controller.js';
const router = express.Router();

// GET /api/movie - Get all movies (supports ?genre=Action)
router.get('/', reqLogin, getAllMovies);

// GET /api/movies/:id - Get a specific movie by ID
router.get('/:id', reqLogin, getMovie);

// POST /api/movies - Add a new movie
router.post('/', reqLogin, reqAdmin, addMovie);

// DEL del
router.delete('/:id', reqLogin, reqAdmin, deleteMovie);

router.post('/:id/cast', reqLogin, reqAdmin, addCastToMovie);
export default router;