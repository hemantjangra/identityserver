import {Request, Response} from 'express';
import Client, {ClientInterface} from "../models/client";
import AuthCodeModel, {AuthCodeInterface} from "../models/authCodeModel";
import RefreshTokenModel, {RefreshTokenInterface} from "../models/refreshTokenModel";
import TokenModel , {TokenModelInterface} from "../models/tokenModel";
import axios from 'axios';

export const handle = (request: Request, res: Response) => {
    const {response_type, client_id, redirect_uri, scope, state} = request.query;

    if (!response_type) {
        // cancel the request - we miss the response type
    }

    if (response_type !== 'code') {
        // notify the user about an unsupported response type
    }

    if (!client_id) {
        // cancel the request - client id is missing
    }

    Client.findOne({
        clientId: client_id
    }, (err, client: ClientInterface) => {
        if (err) {
            // handle the error by passing it to the middleware
        }

        if (!client) {
            // cancel the request - the client does not exist
        }
        if (redirect_uri !== client.redirectUri) {
            // cancel the request
        }
        if (scope !== client.scope) {
            // handle the scope
        }

        const authCode = new AuthCodeModel({
            clientId: client_id,
            userId: client.userId,
            redirectUri: redirect_uri
        });
        authCode.save(); //add promise and handle

        const state = request.query.state;
        const response = {
            state: state,
            code: authCode.code
        };
        if (redirect_uri) {
            const redirect = `${redirect_uri}?code=${response.code}${state === undefined ? '' : `&state=${state}`}`;
            res.redirect(redirect);
        }
        else{
            res.json(response);
        }
    });
};

export const handleToken = (request: Request, response: Response) =>{
  const {grant_type, code, redirect_uri, client_id} = request.body;
  if(!grant_type){
      //cancel request no grant type
  }
  if(grant_type === 'authorization_code'){
      AuthCodeModel.findOne({
          code: code
      }, (error, authCode: AuthCodeInterface) =>{
          if(error){
              //handle error
          }
          if(!authCode){
              //no valid record in db, handle it here
          }
          if(authCode?.consumed){
              //token consumed cancel request
          }
          authCode.consumed = true;
          authCode.save(); //handle promise
          
          if(authCode.redirectUri!==redirect_uri){
              //cancel request here
          }
          Client.findOne({
              clientId: client_id
          }, (error, client: ClientInterface) =>{
             if(error){
                 //mismatch or not found
             } 
             if(!client){
                 //mismatch or does not exist
             }
             const {userId} = authCode;
             const refreshTokenEntity: RefreshTokenInterface = new RefreshTokenModel({
                 userId: userId
             });
             refreshTokenEntity.save(); //handle promise here
              
              const token: TokenModelInterface = new TokenModel({
                  userId: userId,
                  refreshToken: refreshTokenEntity.token
              });
              token.save(); //handle promise here
              
              
              response.json({...token});
          });
      });
  }
};


//this acts as client in same application and asks for token

export const handleAuthCode = (request: Request, response: Response) =>{
    const {code} = request.query;
    if(!code){
        //handle and return error
    }
    const client_id ='2b01678f-6335-4aae-ba5f-09f1f50619dd'; //meant to be with client
    const grant_type = 'authorization_code';
    const redirect_uri = 'http://localhost:5000';
    
    const tokenRequestUrl =`http://localhost:5000/token`;
    console.log(tokenRequestUrl);
    axios.post(tokenRequestUrl, {
        client_id: client_id,
        code: code,
        grant_type: grant_type,
        redirect_uri: redirect_uri
    }).
    then(res=> {
        response.json(res.data);
    }).
    catch( err => response.json(err));
};