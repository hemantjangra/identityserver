import mongoose from "mongoose";

export default (db: any, dbName: any) =>{
    const connect = () =>{
        mongoose.connect(db,{
            dbName: dbName,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            bufferCommands: false
        }).then(()=>{
            console.log(`Successfully connected to ${dbName}`); //add logger here
        }).catch(error =>{
           console.log(`Error occurred while connecting to ${dbName}`);
           return process.exit(1);
        });
        
    };
    connect();
    mongoose.connection.on("disconnected", connect);
}