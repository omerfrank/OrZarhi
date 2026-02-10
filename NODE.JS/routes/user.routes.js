import express from 'express';
import { reqLogin, reqAdmin } from '../middleware/middleware.auth.js';
import {register,login,update, logout, getAllUsers, getUser, addFavorite, getFavorites, removeFavorite, getMe } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login',login);
router.post('/register', register);
router.put('/update', reqLogin, update);
router.post('/logout', reqLogin, logout);

router.get('/me', reqLogin, getMe);
router.get('/', reqAdmin, getAllUsers);
router.get('/:id', reqLogin, getUser);

router.post('/add-favorite', reqLogin, addFavorite);
router.get('/favorites/:userId', reqLogin, getFavorites); 
router.delete('/remove-favorite', reqLogin, removeFavorite);

export default router;