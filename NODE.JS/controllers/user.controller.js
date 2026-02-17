// auth controller
import express from "express";
import User from "../models/user.js";
import Movie from "../models/movie.js";
import bcrypt from "bcrypt";
import { Vlogin, Vregister, VupdateUser } from "../validations/auth.schema.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const parsed = Vregister.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues || [];
      const errorMsg = issues[0]?.message || "Validation failed";

      return res.status(400).json({ success: false, error: errorMsg });
    }

    const { username, email, password } = req.body;

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res
        .status(409)
        .json({ success: false, error: "user already exist" });
    }

    const passwordhash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: passwordhash });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Error creating user" });
    }

    return res.status(201).json({ success: true, message: "user created" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "internal server error" });
  }
}

export async function login(req, res) {
  try {
    const parsed = Vlogin.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues || [];
      const errorMsg = issues[0]?.message || "Validation failed";

      return res.status(400).json({ success: false, error: errorMsg });
    }
    const { email, password } = req.body;

    const UserPtr = await User.findOne({ email });
    if (!UserPtr) {
      return res.status(401).json({ success: false, error: "incorrect" });
    }

    const match = await bcrypt.compare(password, UserPtr.password);

    if (match) {
      req.session.userId = UserPtr._id;
      const token = jwt.sign(
        { userId: UserPtr._id, role: UserPtr.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      // Set JWT token as HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Also set session
      req.session.userId = UserPtr._id;

      return res.status(200).json({
        success: true,
        message: "login true",
        user: {
          id: UserPtr._id,
          username: UserPtr.username,
          email: UserPtr.email,
        },
      });
    } else {
      return res.status(401).json({ success: false, error: "incorrect" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "internal error" });
  }
}

// Get a specific user by ID: GET /api/auth/:id
export async function getUser(req, res) {
  try {
    const { id } = req.params;
    // Find user by ID and exclude the password field
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("favorites");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get user error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}
export async function getMe(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Not authenticated" });
    }

    await user.populate("favorites");

    user.favorites = user.favorites.filter((movie) => movie !== null);

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get me error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}

export function logout(req, res) {
  // Clear the JWT token cookie
  res.clearCookie("token");

  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
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
      return res
        .status(400)
        .json({ success: false, error: "UserId and MovieId are required" });
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { favorites: movieId } },
      { new: true },
    ).select("favorites");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Added to favorites",
        data: user.favorites,
      });
  } catch (error) {
    console.error("Add favorite error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}

// get-all-favorites: GET (userId)
export async function getFavorites(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "UserId is required" });
    }

    const user = await User.findById(userId).populate("favorites");

    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    user.favorites = user.favorites.filter((movie) => movie !== null);

    return res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    console.error("Get favorites error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}

// remove-favorite: PATCH (movieId)
export async function removeFavorite(req, res) {
  try {
    const { movieId } = req.body;
    const userId = req.session?.userId;

    if (!userId)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    if (!movieId)
      return res
        .status(400)
        .json({ success: false, error: "MovieId is required" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: movieId } },
      { new: true },
    ).select("favorites");

    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    return res
      .status(200)
      .json({
        success: true,
        message: "Removed from favorites",
        data: user.favorites,
      });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}
