import express, {Application} from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import connect from './mongohelper';
import {handle, handleAuthCode, handleToken} from './Authorization/controllers/authorize.controller';
import {rootHandler} from './Authorization/controllers/root.controller';
import {Request, Response} from 'express';
import AppError from './extensions/appError';

dotenv.config();

const app: Application = express();

const port = process.env.PORT || 5000;

const db = process.env.DB_URL;
const dbName = process.env.DB_NAME;

if(db && dbName){
   connect(db, dbName);
}
else{
   //throw exception with middleware
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', rootHandler);

app.get('/authorize', handle);

app.post('/token', handleToken);

app.get('/handleAuthCode', handleAuthCode);

app.listen(port, () =>{
   console.log(`Listening to port ${port}`);
});

app.use((error: Error, req:Request, res: Response, next:Function)=>{
   console.error(error.message);
   res.status(500).send(error.message);
});

export default app;
