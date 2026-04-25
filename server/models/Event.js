import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  totalSeats: Number,
  availableSeats: Number,
  createdBy: String
});

export default mongoose.model("Event", eventSchema);