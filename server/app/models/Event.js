import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },

    description : {
        type : String,
        required : true,
        trim : true
    },

    date : {
        type : Date,
        required : true
    },

    venue : {
        type : String,
        required : true
    },

    registrationFee : {
        type : Number,
        required : true
    },

    maxParticipants : {
        type : Number,
        required : true
    },

    registrationDeadline : {
        type : Date,
        required : true,
    },

    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
        timestamps: true
    })

export default mongoose.model('Event', eventSchema)