import mongoose from "mongoose";

const registrationSchema = mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    eventId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    },

    paymentStatus : {
        type : String,
        enum : ['pending', 'paid', 'failed', 'refunded'],
        default : 'pending'
    },

    amountPaid : {
        type : Number,
        default : 0
    },

    registrationStatus : {
        type : String,
        enum : ['registered', 'cancelled'],
        default : 'registered',
    }
},

{
    timestamps : true
})

registrationSchema.index(
    {
        userId: 1,
        eventId: 1
    },
    {
        unique: true
    }
)

export default mongoose.model('Registration',registrationSchema )