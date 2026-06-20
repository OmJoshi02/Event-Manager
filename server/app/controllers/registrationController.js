import Registration from "../models/Registration.js"
import Event from "../models/Event.js"


export const registerForEvent = async (req, res)=>{
    try {
        
        const {eventId} = req.body

        const userId = req.user.id

        const event = await Event.findById(eventId)

        if(!event){
            return res.status(404).json({
                message : 'event not found'
            })
        }

        const existingRegistration = await Registration.findOne({userId, eventId})

        if(existingRegistration){
            return res.status(409).json({
                message : 'already registered'
            })
        }

        if (event.status !== 'upcoming') {
            return res.status(400).json({
            message: 'Registration closed'
        })
        }

        if (new Date() > event.registrationDeadline) {
            return res.status(400).json({
                message: 'Registration deadline passed'
            })
        }

        const registrationsCount =
            await Registration.countDocuments({
            eventId
        })

        if (registrationsCount >= event.maxParticipants) {
            return res.status(400).json({
                message: 'Event is full'
            })
        }

        const registration = await Registration.create({
            userId, eventId
        })

        

        res.status(201).json({
            message : 'registration successful',
            registration
        })
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

export const getMyRegistration = async (req, res) =>{
    try {
        const user = await Registration.find({
            userId : req.user.id
        }).populate('eventId')

        if(!user){
            res.status(409).json({
                message : 'user not found'
            })
        }

        res.status(201).json({
            user
        })
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

export const getEventRegistrations = async (req, res) =>{
    try {
        const user = await Registration.find({
            eventId : req.params.eventId
        }).populate('userId')

         if(!user){
            res.status(409).json({
                message : 'user not found'
            })
        }

        res.status(201).json({
            user
        })
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

export const cancelRegistration = async (req, res) =>{

    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);

        if(!registration){
            return res.status(404).json({
                message : 'registration not found'
            })
        }

        res.status(200).json({
            message : "registration deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
    
}