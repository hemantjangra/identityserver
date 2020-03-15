import {Request, Response} from 'express';
import Client, {ClientInterface} from "../models/client";
import AuthCodeModel, {AuthCodeInterface} from "../models/authCodeModel";
import RefreshTokenModel, {RefreshTokenInterface} from "../models/refreshTokenModel";
import TokenModel , {TokenModelInterface} from "../models/tokenModel";
import axios from 'axios';
import AppError from '../../extensions/appError';
import {clientDal, authDao, refreshTokenDao, tokenDao} from "../DAL";

export const handle = async (request: Request, res: Response, next: Function) => {
    const {response_type, client_id, redirect_uri, scope, state} = request.query;
    //TODO: to be moved to validators
    if (!client_id || response_type!== 'code') {
        next(Error(`Request parameters are not properly formatted`));
    }
    try {
        const client = await clientDal.findClientByClientId(client_id);
        if (redirect_uri !== client.redirectUri) {
            res.status(500);
        }
        if (scope !== client.scope) {
            res.status(500);
        }
        const authCode = new AuthCodeModel({
            clientId: client_id,
            userId: client.userId,
            redirectUri: redirect_uri
        });
        
        const result = await authDao.saveAuthCode(authCode);
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
    }catch (error) {
        res.status(500);
    }
};

export const handleToken = async (request: Request, response: Response, next: Function) =>{
  const {grant_type, code, redirect_uri, client_id} = request.body;
  if(!grant_type){
      next(Error("grant type not found"));
  }
  if(grant_type === 'authorization_code'){
      try{
        const authCode = await authDao.findAuthCodeByCode(code);
        if(authCode.error){
            next(authCode.error);
        }
        if(authCode.authCode.consumed){
            next(Error('auth token is already consumed'));
        }
        const authCodeToSave = authCode.authCode;
        authCodeToSave.consumed = true;
        await authDao.saveAuthCode(authCodeToSave);
        if(authCodeToSave.redirectUri!==redirect_uri){
            next(Error('Redirect url does not match with redirect url in auth code entity'));
        }

        const clientResult = await clientDal.findClientByClientId(client_id);
        const {userId} = authCodeToSave;

        const refreshTokenEntity: RefreshTokenInterface = new RefreshTokenModel({
            userId: userId
        });
        const refreshTokenSaveResult = await refreshTokenDao.saveRefreshToken(refreshTokenEntity);
        const token: TokenModelInterface = new TokenModel({
            userId: userId,
            refreshToken: refreshTokenEntity.token
        });
        const tokenResult = await tokenDao.saveToken(token); 
        response.json({...tokenResult.token?.toObject()});
      }catch(error){
        next(Error("Exception occured while handling token"));
      }
  }
};

//this acts as client in same application and asks for token

export const handleAuthCode = (request: Request, response: Response, next: Function) =>{
    const {code, client_id, grant_type, redirect_uri} = request.query;
    if(!code || !grant_type || !client_id || !redirect_uri){
        next(Error("Request parameters are not properly formatted"));
    }
    //const client_id ='2b01678f-6335-4aae-ba5f-09f1f50619dd'; //meant to be with client  //pass with request
    //const grant_type = 'authorization_code';
    //const redirect_uri = 'http://localhost:5000';
    
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