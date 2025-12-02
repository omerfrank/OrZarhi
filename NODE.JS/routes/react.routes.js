// auth.routes
import express from 'express';
import {GetAll } from '../controllers/react.controller.js';
const router = express.Router();
router.get('/getall',GetAll);
router.get('/test',(req, res) => {
  res.send('api works?');
});

export default router;