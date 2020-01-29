import mongoose, {Schema, Document} from 'mongoose';
import v4 from 'uuid/v4';

export interface RefreshTokenModel extends Document{
    userId: string,
    token: string,
    createdAt: Date,
    consumed: boolean
}

const RefreshTokenSchema:Schema = new Schema<any>({
   userId: {type: String},
   token:{type: String, default: v4()},
   createdAt:{type:Date, default: Date.now()},
   consumed:{type: Boolean, default: false} 
});

const refreshTokenModel = mongoose.model<RefreshTokenModel>("RefreshTokenModel", RefreshTokenSchema);
export default refreshTokenModel;