import express from 'express';
import AuthHandeler from './auth.routes.js';
import ReactHandeler from './react.routes.js';
import User from '../models/user.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('api works?');
});

router.use('/auth',AuthHandeler) 
router.use('/react', ReactHandeler)


router.get('/gelall', async (req, res) => {
  const users = await User.find({}).select('name');
  return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
});
export default router;
