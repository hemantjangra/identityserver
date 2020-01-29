import mongoose, {Schema, Document} from 'mongoose';

export interface TokenModelInterface extends Document{
    userId: string,
    refreshToken: string,
    accessToken: string,
    expiresIn: string,
    tokenType: string
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
export default TOkenModel;