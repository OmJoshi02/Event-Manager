import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

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

export default router;