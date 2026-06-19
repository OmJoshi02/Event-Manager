import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name : String,
    description : String
})

export default mongoose.model('Event', eventSchema)