import mongoose from "mongoose";
process.loadEnvFile()
const URI = process.env.MONGODB_URLSTRING
const DATABASE_NAME = process.env.DATABASE_NAME
export const connectDB = async()=> {
    try{
        await mongoose.connect(URI+DATABASE_NAME)
        console.log('Conectado a la base de datos')
    }catch(e){
        console.log(e)
    }
}