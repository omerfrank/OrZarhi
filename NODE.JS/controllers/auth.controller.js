// auth controller
import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { Vlogin, Vregister, VupdateUser } from '../validations/auth.schema.js';

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
            req.session.userId = UserPtr._id; 
            req.session.username = UserPtr.username;
            return res.status(200).json({ success: true, message: 'login true' });
        } else {
            return res.status(401).json({ success: false, error: 'incorrect' });
        }
             
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'internal error' });
    }
}

export async function update(req, res) {
    try {
        // 1. Authenticate
        const userId = req.session?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized: No session found' });
        }

        // 2. Validate
        // .safeParse handles "optional" correctly (ignores missing fields)
        const parsed = VupdateUser.safeParse(req.body);
        if (!parsed.success) {
            const issues = parsed.error.issues || [];
            const errorMsg = issues[0]?.message || 'Validation failed';
            return res.status(400).json({ success: false, error: errorMsg });
        }

        const { email, password } = req.body;
        const updates = {};

        // 3. Check for Email Update
        // "if (email)" is true only if email is a non-empty string
        if (email) {
            // Check uniqueness against OTHER users
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(409).json({ success: false, error: 'Email already in use' });
            }
            updates.email = email;
        }

        // 4. Check for Password Update
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            updates.password = passwordHash;
        }

        // 5. If no fields were provided to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, error: 'No valid fields provided to update' });
        }

        // 6. Execute Update
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'User updated successfully', 
            user: updatedUser 
        });

    } catch (error) {
        console.error('Update Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, error: "Logout failed" });
        }
        res.clearCookie('connect.sid'); // clear the cookie
        return res.status(200).json({ success: true, message: "Logged out" });
    });
}