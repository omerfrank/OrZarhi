import express from 'express';
import AuthHandler from './auth.routes.js';
import ReactHandler from './react.routes.js';
import User from '../models/user.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('api works?');
});

router.use('/auth',AuthHandler) 
router.use('/react', ReactHandler)


export default router;
