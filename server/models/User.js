import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  providerId: {
    type: String,
    required: true
  },
  name: String,
  email: String
});

export default mongoose.model("User", userSchema);