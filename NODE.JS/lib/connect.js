import mongoose from "mongoose";
export function connectDB(){
    mongoose.connect(process.env.DATABASE_URL);
    const database = mongoose.connection;

    database.on('error',(error)=>{
        console.log('data errorr: ',error); 
    });
    database.once('open',()=>{
        console.log("connectedd");
    });
}