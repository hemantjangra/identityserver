import express, {Application} from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import connect from './mongohelper';
import { handle } from './controllers/authorize_controller';
import Client, {ClientInterface} from './models/client';

dotenv.config();

const app: Application = express();

const port = process.env.PORT || 5000;

const db = process.env.DB_URL;
const dbName = process.env.DB_NAME;

console.log(`DB url is ${db}`);
console.log(`DB name is ${dbName}`);

if(db && dbName){
   connect(db, dbName);
}
else{
   //throw exception with middleware
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) =>{
   let client : ClientInterface = new Client({
      name: 'Test',
      userId: '1',
      redirectUri:'http://localhost:5000/callback',
      scope: ''
   });
   client.save((error)=>{
      res.json(client);
   });
});

app.get('/authorize', handle);

app.listen(port, () =>{
   console.log(`Listening to port ${port}`);
});

export default app;
