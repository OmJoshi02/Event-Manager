import User from "../models/User.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

export const getStats = async (req, res) =>{
    try {
       const totalUser = await User.countDocuments()

        const totalEvents = await Event.countDocuments()

        const totalRegistration = await Event.countDocuments()

        const events = await Event.find()

        const totalRevenue = events.reduce(
            (sum, event) =>
                sum + (event.registrationFee || 0),
            0
        )

        res.status(201).json({
            totalUser,
            totalEvents,
            totalRegistration,
            totalRevenue
        }) 
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }

}

export const getEventStats = async (req, res) => {
    try {

        const stats = await Registration.aggregate([
            {
                $group: {
                    _id: '$eventId',
                    registrations: {
                        $sum: 1
                    }
                }
            },

            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'event'
                }
            },

            {
                $unwind: '$event'
            },

            {
                $project: {
                    _id: 0,
                    eventName: '$event.name',
                    registrations: 1,
                    revenue: {
                        $multiply: [
                            '$registrations',
                            {
                                $ifNull: [
                                    '$event.registrationFee',
                                    0
                                ]
                            }
                        ]
                    }
                }
            }
        ])

        res.status(200).json(stats)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}