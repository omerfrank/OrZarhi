// auth controller
import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { Vlogin, Vregister } from '../validations/auth.schema.js';

export async function register(req, res) {
    try {
        const parsed = Vregister.safeParse(req.body);
        if (!parsed.success) {
            const issues = parsed.error.issues || [];
            const errorMsg = issues[0]?.message || 'Validation failed';
            
            return res.status(400).json({ success: false, error: errorMsg });
        }

        // Fix 1: Destructure 'username' to match the User model schema
        const { username, email, password } = req.body;
        
        const emailExist = await User.findOne({ email });
        if (emailExist){
            return res.status(409).json({ success: false, error: 'user already exist' });
        }

        const passwordhash = await bcrypt.hash(password, 10);        
        
        // Fix 2: Create user with correct 'username' field
        const user = await User.create({ username, email, password: passwordhash });
        
        if (!user){
            return res.status(404).json({ success: false, error: 'Error creating user' });
        }

        return res.status(201).json({ success: true, message: 'user created' });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'internal server error' });
    }
}

export async function login(req, res) {
    try {
        const parsed = Vlogin.safeParse(req.body);
        if (!parsed.success) {
            const issues = parsed.error.issues || [];
            const errorMsg = issues[0]?.message || 'Validation failed';
            
            return res.status(400).json({ success: false, error: errorMsg });
        }
        const { email, password } = req.body;
        
        const UserPtr = await User.findOne({ email });
        if (!UserPtr){
            return res.status(401).json({ success: false, error: 'incorrect' });
        }

        // Fix 3: Use await instead of callback to prevent request hanging
        const match = await bcrypt.compare(password, UserPtr.password);

        if (match) {
            return res.status(200).json({ success: true, message: 'login true' });
        } else {
            return res.status(401).json({ success: false, error: 'incorrect' });
        }
             
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'internal error' });
    }
}