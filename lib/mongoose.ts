import mongoose from "mongoose"

let ifConnected = false
 export const  connectToDB = async () => {
    mongoose.set("strictQuery", true)

    if(!process.env.DATABASE_URL) return console.log('DATABASE_URL is not defined')
    if(ifConnected) return console.log('Already connected to database')

   
        try {
            await mongoose.connect(process.env.DATABASE_URL)
            ifConnected = true
            console.log('Connected to database')
            
        } catch (error) {
            console.log('Failed to connect to database')
            
        }
 }