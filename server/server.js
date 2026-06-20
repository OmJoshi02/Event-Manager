import express from 'express'
import dotenv from 'dotenv'
import connectDB from './app/config/db.js'
import eventRoutes from './app/routes/eventRoutes.js'
import authRoutes from './app/routes/authRoutes.js'
import registrationRoutes from './app/routes/registrationRoutes.js'
    

const app = express()
dotenv.config()

app.use(express.json())
connectDB()

app.use('/events', eventRoutes)

app.use('/auth', authRoutes)

app.use('/registration', registrationRoutes)

const PORT = process.env.PORT || 4000
    app.listen(PORT, ()=>{
        console.log(`Server running on PORT : ${PORT}`)
})
    


