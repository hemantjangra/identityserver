import mongoose, {Schema, Document} from 'mongoose';
import {RefreshTokenInterface} from './refreshTokenModel';

export interface TokenModelInterface extends Document{
    userId: string,
    refreshToken: RefreshTokenInterface['token'],
    accessToken: string,
    expiresIn?: string,
    tokenType?: string,
    consumed?: boolean,
    createdAt?: Date
}

const TokenModelSchema : Schema = new Schema<any>({
   userId:{type: String},
   refreshToken: {type: String, unique: true},
   accessToken: {type: String, unique: true},
   expiresIn: {type: Date, default: 10800},
   tokenType: {type: String, default: 'bearer'},
   consumed: {type: Boolean, default: false},
   createdAt:{type: Date, default: Date.now(), expires: '3m'} 
});

const TokenModel = mongoose.model<TokenModelInterface>("TokenModel", TokenModelSchema);
export default TokenModel;