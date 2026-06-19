import mongoose from 'mongoose'

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Mongodb connected')
    }catch(e){
        console.error(e.message)
        process.exit(1)
    }
}

export default connectDB