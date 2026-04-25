import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
  seats: Number,
  name: String,
  email: String
});

export default mongoose.model("Booking", bookingSchema);