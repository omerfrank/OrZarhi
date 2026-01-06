import express from 'express';
import { reqLogin } from '../controllers/auth.controller.js';
import {register,login,update, logout, getAllUsers, getUser, addFavorite, getFavorites, removeFavorite, getMe } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.put('/update', update);
router.post('/logout', logout);

router.get('/me', reqLogin, getMe);
router.get('/', getAllUsers);
router.get('/:id', getUser);

router.post('/add-favorite', addFavorite);
router.get('/favorites/:userId', getFavorites); 
router.delete('/remove-favorite', removeFavorite);

export default router;