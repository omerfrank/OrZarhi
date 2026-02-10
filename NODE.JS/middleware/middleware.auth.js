import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function reqLogin(req, res, next) {
  try {
    // 1. Check if a Session exists (Cookie based auth)
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select("-password");
      if (user) {
        req.user = user;
        return next(); // Session is valid, proceed
      }
    }

    // 2. If no session, check for JWT Token (Header based auth)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Access denied. No token or session provided.",
        });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token." });
  }
}

export function reqAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    console.log(
      "Admin access denied. Current role:",
      req.user?.role || "Guest",
    );
    return res
      .status(403)
      .json({
        success: false,
        error: "Access denied. Admin privileges required.",
      });
  }
  next();
}
