import Event from "../models/Event.js"

export const createEvent = async (req, res) =>{
    try{
        const event = await Event.create(req.body)

        res.status(200).json({
            message : 'Event created',
            event
        })
    }catch(e){
        console.error(e.message)
        res.status(500).json({
            error : e.message
        })
    }
}

export const getEvent = async (req, res)=>{
    try {
        const events = await Event.find()

        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

export const getEventById = async (req, res)=>{
    try {
        const event = await Event.findById(req.params.id)

        if(!event){
            return res.status(404).json({
                message : 'Event not found'
            })
        }

        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({
            message : error
        })
    }
}


export const updateEvent = async (req, res) =>{
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true}
        )

        if(!event){
            return res.status(404).json({
                message : "Event not found"
            })
        }

        res.status(200).json(event)

    } catch (error) {
        res.status(500).json({
            message : error
        })
    }
}

export const deleteEvent = async (req, res) =>{
    try {
        
        const event = await Event.findByIdAndDelete(req.params.id)

        if(!event){
            return res.json(404).json({
                message : 'event not found'
            })
        }

        res.status(200).json({
            message : "event deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            message : error
        })
    }
}