import * as mongoose from "mongoose";

const mongoConnection = async() => {
    try {
         await mongoose.connect(`${process.env.DB_URL}`, {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            bufferCommands: false
        });
    }catch (error) {
      return;
    };
    
    export default mongoConnection();