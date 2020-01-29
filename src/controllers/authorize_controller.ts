import {Request, Response} from 'express';
import Client from "../models/client";
import AuthCodeModel from "../models/authCodeModel";

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