import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

const ADMIN_EMAIL = "omcjoshi@gmail.com";

function isAdmin(req, res, next) {
  if (req.user && req.user.email === ADMIN_EMAIL) {
    return next();
  }
  return res.status(403).json({ message: "Not authorized" });
}

router.post("/", isAdmin, async (req, res) => {
  const { title, date, totalSeats } = req.body;

  const event = await Event.create({
    title,
    date,
    totalSeats,
    availableSeats: totalSeats
  });

  res.json(event);
});

// Create event
router.post("/", async (req, res) => {
  const event = await Event.create({
    ...req.body,
    availableSeats: req.body.totalSeats
  });
  res.json(event);
});

// Get all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

function isAdmin(req, res, next) {
  if (req.user && req.user.email === "your-email@gmail.com") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized" });
}

export default router;