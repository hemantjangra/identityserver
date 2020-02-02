import {Request, Response} from 'express';
import Client, {ClientInterface} from "../models/client";
import AuthCodeModel, {AuthCodeInterface} from "../models/authCodeModel";
import RefreshTokenModel, {RefreshTokenInterface} from "../models/refreshTokenModel";
import TokenModel , {TokenModelInterface} from "../models/tokenModel";

export const handle = (request: Request, res: Response) => {
    const responseType = request.query.response_type;
    const clientId = request.query.client_id;

    if (!responseType) {
        // cancel the request - we miss the response type
    }

    if (responseType !== 'code') {
        // notify the user about an unsupported response type
    }

    if (!clientId) {
        // cancel the request - client id is missing
    }

    Client.findOne({
        clientId: clientId
    }, (err, client) => {
        if (err) {
            // handle the error by passing it to the middleware
        }

        if (!client) {
            // cancel the request - the client does not exist
        }
        const redirectUri = request.query.request_uri;
        const { clientRedirectUri, clientScope, clientUserId } = redirectUri; 
        if (redirectUri !== clientRedirectUri) {
            // cancel the request
        }

        const scope = request.query.scope;
        if (scope !== clientScope) {
            // handle the scope
        }

        const authCode = new AuthCodeModel({
            clientId: clientId,
            userId: clientUserId,
            redirectUri: redirectUri
        });
        authCode.save(); //add promise and handle

        const state = request.query.state;
        const response = {
            state: state,
            code: authCode.code
        };
        if (redirectUri) {
            const redirect = `${redirectUri}?code=${response.code}${state === undefined ? '' : `&state=${state}`}`;
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
                  userId: userId
              });
              token.save(); //handle promise here
              
              
              response.json({...token});
          });
      });
  }
};