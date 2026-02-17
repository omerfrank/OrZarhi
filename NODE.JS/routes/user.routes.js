import express from 'express';
import { reqLogin} from '../middleware/middleware.auth.js';
import {register,login, logout, getUser, addFavorite, getFavorites, removeFavorite, getMe } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login',login);
router.post('/register', register);
router.post('/logout', reqLogin, logout);

router.get('/me', reqLogin, getMe);
router.get('/:id', reqLogin, getUser);

router.post('/add-favorite', reqLogin, addFavorite);
router.get('/favorites/:userId', reqLogin, getFavorites); 
router.delete('/remove-favorite', reqLogin, removeFavorite);

export default router;