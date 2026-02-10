import express from 'express';
import UserHandler from './user.routes.js';
import ReactHandler from './react.routes.js';
import MovieHandler from './movie.routes.js';
import CastHandler from './cast.routes.js';
import ReviewHandler from './review.routes.js';
const router = express.Router();

router.use('/user',UserHandler) 
router.use('/react', ReactHandler)
router.use('/movie', MovieHandler)
router.use('/cast',CastHandler)
router.use('/review',ReviewHandler)


export default router;
