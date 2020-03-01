import {Request, Response} from 'express';
import Client, {ClientInterface} from "../models/client";

export const rootHandler = (req:Request, res:Response, next:Function) =>{
    Client.find((error, clientResult: ClientInterface[])=>{
        if(error){
            next(error);
        }
        if(clientResult){
            let userId = clientResult.length;
            const client: ClientInterface=new Client({
                userId: userId++,
                redirectUri: 'http://localhost:5000/callback',
                scope: ''
            });
            client.save().then(result=>res.json(result)).catch(error=>next(error));
        }
        else {
            const client: ClientInterface = new Client({
                redirectUri: 'http://localhost:5000/callback',
                scope: ''
            });
            client.save().then(result => res.json(result)).catch(err =>{
                err.StatusCode = 503;
                next(err)});
        }
    });
};