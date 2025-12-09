import express from 'express';
import AuthHandler from './auth.routes.js';
import ReactHandler from './react.routes.js';
import MovieHandler from './movie.routes.js';
import CastHandler from './cast.routes.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('api works?');
});

router.use('/auth',AuthHandler) 
router.use('/react', ReactHandler)
router.use('/movie', MovieHandler)
router.use('/cast',CastHandler)


export default router;
