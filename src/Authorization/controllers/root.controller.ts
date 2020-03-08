import {Request, Response} from 'express';
import Client, {ClientInterface} from "../models/client";
import {clientDal} from "../DAL";


export const rootHandler = async (req:Request, res:Response, next:Function) =>{
    try {
        const clientData:ClientInterface = new Client({
            redirectUri: 'http://localhost:5000/callback',
            scope: ''
        });
        const result = await clientDal.saveClient(clientData);
        if(result.error){
            res.status(500);
        }
        res.status(200).json(result);
    }catch(error){
        res.status(500);
    }
};

