// auth.routes
import express from 'express';
import {GetAllUsers } from '../controllers/react.controller.js';
const router = express.Router();
router.get('/get-all-users',GetAllUsers);
router.get('/test',(req, res) => {
  res.send('api works?');
});

export default router;