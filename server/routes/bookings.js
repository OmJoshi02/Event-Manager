import express from "express";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { eventId, seats, name, email } = req.body;
  const userId = req.user._id;

  try {
    const existing = await Booking.findOne({ userId, eventId });

    if (existing) {
      return res.status(400).json({
        message: "You already booked this event"
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const booking = await Booking.create({
      userId,
      eventId,
      seats,
      name,
      email
    });

    event.availableSeats -= seats;
    await event.save();

    res.json({ message: "Enrolled successfully", booking });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my bookings
router.get("/my", async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id });
  res.json(bookings);
});


router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔒 Only owner can cancel
    if (booking.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const event = await Event.findById(booking.eventId);

    // 🔄 Restore seats
    event.availableSeats += booking.seats;
    await event.save();

    await booking.deleteOne();

    res.json({ message: "Booking cancelled" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;