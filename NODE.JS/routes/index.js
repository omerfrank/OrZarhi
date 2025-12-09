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

// test users
router.get('/getall', async (req, res) => {
  const users = await User.find({}).select('name');
  return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
});
export default router;
