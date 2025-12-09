import express from 'express';
import {register,login,update, logout } from '../controllers/auth.controller.js';
const router = express.Router();
router.post('/login',login);
router.post('/register',register);
router.put('/update', update);
router.post('/logout', logout);


export default router;