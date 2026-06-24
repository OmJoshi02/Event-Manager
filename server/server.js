import express from 'express'
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv'
import cors from "cors";
import connectDB from './app/config/db.js'
import eventRoutes from './app/routes/eventRoutes.js'
import authRoutes from './app/routes/authRoutes.js'
import registrationRoutes from './app/routes/registrationRoutes.js'
import dashboardRoutes from './app/routes/dashboardRoutes.js'    
import paymentRoutes from './app/routes/paymentRoutes.js'
import userRoutes from "./app/routes/userRoutes.js";

const app = express();
const httpServer = createServer(app);
dotenv.config()

app.use(express.json())
connectDB()
app.use(cors())

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Socket Disconnected:", socket.id);
    });
});


app.use('/api/events', eventRoutes)

app.use('/auth', authRoutes)

app.use('/registration', registrationRoutes)

app.use('/api/dashboard', dashboardRoutes)

app.use('/payment', paymentRoutes)

app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});
    


