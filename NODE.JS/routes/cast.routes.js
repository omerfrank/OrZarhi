import express from 'express';
<<<<<<< HEAD
import { getCastById, getCastByMovieId, createCast, deleteCast } from '../controllers/cast.controller.js';
import {} from '../'
=======
import { reqLogin, reqAdmin } from '../middleware/middleware.auth.js';
import { getCastById, getCastByMovieId, createCast } from '../controllers/cast.controller.js';
>>>>>>> 31ef2550ce7fd1851d8727ebb991e1a95704afa3

const router = express.Router();

// Get specific cast member details
router.get('/:id', reqLogin, getCastById);

// Get all cast members for a specific movie
router.get('/movie/:id', reqLogin, getCastByMovieId);

// Add a new cast member
router.post('/', reqAdmin, createCast);

// delete cast by id
router.delete('/:id', reqAdmin, deleteCast);

export default router;