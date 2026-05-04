import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Auth failed: token missing", req.method, req.originalUrl);
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log("Auth failed: user not found", req.method, req.originalUrl);
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    console.log("Auth success", req.method, req.originalUrl, req.user.email);
    next();
  } catch (error) {
    console.log("Auth failed: token invalid", req.method, req.originalUrl, error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("Role forbidden", req.method, req.originalUrl, req.user?.role);
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
