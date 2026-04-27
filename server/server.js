import express from 'express';
import mongoose from 'mongoose';
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import bookingRoutes from "./routes/bookings.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

async function main() {
    const app = express();
    const PORT = process.env.PORT || 5000;

    // 🔹 Path setup
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 🔹 Middleware
    app.use(express.json());

    //  SESSION FIX (CRITICAL)
    app.set("trust proxy", 1); // 🔥 IMPORTANT for Render

    app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,       // required for HTTPS (Render)
        sameSite: "none"    // required for cross-site cookies (Google)
    }
    }));

    // 🔹 Passport
    app.use(passport.initialize());
    app.use(passport.session());

    //  DEBUG SESSION (very useful)
    app.use((req, res, next) => {
        console.log("SESSION USER:", req.user);
        next();
    });

    //  PREVENT CACHE (fix back button issue)
    app.use((req, res, next) => {
        res.set("Cache-Control", "no-store");
        next();
    });

    // 🔹 Serve frontend
    app.use(express.static(path.join(__dirname, "../public")));

    // 🔹 Database
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.log("DB Error:", err);
    }

    // 🔹 Auth Middleware
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();

        // API → JSON response
        if (req.headers.accept?.includes("json")) {
            return res.status(401).json({ message: "Not logged in" });
        }

        // Frontend → redirect
        res.redirect("/");
    }

    // 🔹 Routes
    app.use("/auth", authRoutes);
    app.use("/events", eventRoutes);
    app.use("/bookings", isLoggedIn, bookingRoutes);

    // 🔹 Dashboard route
    app.get("/dashboard", isLoggedIn, (req, res) => {
        res.redirect("/dashboard.html");
    });

    console.log("DB NAME:", mongoose.connection.name);
    // 🔹 Start server
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}

main();