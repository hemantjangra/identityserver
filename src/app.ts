import * as express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.get('/', (req, res) =>{
   res.send("Hello World"); 
});

app.listen('3000', () =>{
   console.log("Listening to port 3000");
});

export default app;
