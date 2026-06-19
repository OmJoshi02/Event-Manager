import express from 'express'
import dotenv from 'dotenv'
import connectDB from './app/config/db.js'
import eventRoutes from './app/routes/eventRoutes.js'
    

const app = express()
dotenv.config()

app.use(express.json())
connectDB()

app.use('/events', eventRoutes)


const PORT = process.env.PORT || 4000
    app.listen(PORT, ()=>{
        console.log(`Server running on PORT : ${PORT}`)
})
    


