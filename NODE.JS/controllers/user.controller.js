// auth controller
import express from 'express';
import User from '../models/user.js';
import Movie from '../models/movie.js';
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
// Get a specific user by ID: GET /api/auth/:id
export async function getUser(req, res) {
    try {
        const { id } = req.params;
        // Find user by ID and exclude the password field
        const user = await User.findById(id).select('-password').populate('favorites');
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export async function getMe(req, res) {
    try {
        const userId = req.session?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }

        const user = await User.findById(userId).select('-password').populate('favorites');
        
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        user.favorites = user.favorites.filter(movie => movie !== null);

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Get me error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// Get all users: GET /api/auth/
export async function getAllUsers(req, res) {
    try {
        // Fetch all users and exclude their passwords
        const users = await User.find({}).select('-password');
        return res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
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

// favorite-movie: POST (userId, movieId)
export async function addFavorite(req, res) {
    try {
        const { userId, movieId } = req.body;
        
        // Prioritize userId from body, fallback to session if available
        const targetUserId = userId || req.session?.userId;

        if (!targetUserId || !movieId) {
            return res.status(400).json({ success: false, error: "UserId and MovieId are required" });
        }

        const user = await User.findByIdAndUpdate(
            targetUserId,
            { $addToSet: { favorites: movieId } }, // addToSet prevents duplicates
            { new: true }
        ).select('favorites');

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        return res.status(200).json({ success: true, message: "Added to favorites", data: user.favorites });
    } catch (error) {
        console.error("Add favorite error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// get-all-favorites: GET (userId)
export async function getFavorites(req, res) {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ success: false, error: "UserId is required" });
        }

        const user = await User.findById(userId).populate('favorites');
        
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        user.favorites = user.favorites.filter(movie => movie !== null);

        return res.status(200).json({ success: true, data: user.favorites });
    } catch (error) {
        console.error("Get favorites error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// remove-favorite: PATCH (movieId)
export async function removeFavorite(req, res) {
    try {
        const { movieId } = req.body; 
        const userId = req.session?.userId; // Assuming removal is for the logged-in user

        if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
        if (!movieId) return res.status(400).json({ success: false, error: "MovieId is required" });

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: movieId } }, // $pull removes the item from the array
            { new: true }
        ).select('favorites');

        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        return res.status(200).json({ success: true, message: "Removed from favorites", data: user.favorites });
    } catch (error) {
        console.error("Remove favorite error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}