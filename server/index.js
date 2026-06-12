import express from 'express'
import dotenv from 'dotenv'

const app = express();
dotenv.config();

app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Hello from server');
})


const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Listening on PORT : ${PORT}`)
})