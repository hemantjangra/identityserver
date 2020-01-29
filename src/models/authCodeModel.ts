import mongoose, {Schema, Document} from 'mongoose';
import uuidv4 from 'uuid/v4';

export interface AuthCodeModel extends Document{
    code: string,
    createdAt: Date,
    consumed: boolean,
    clientId: string,
    userId: string,
    redirectUri: string
}

const AuthCodeSchema: Schema = new Schema<any>({
    code:{type: String, default: uuidv4()},
    createdAt:{type: Date, default: Date.now(), expires: '10m'},
    consumed:{type: Boolean, default: false},
    clientId: {type: String},
    userId:{type: String},
    redirectUri:{type: String}
});

const AuthCodeModel = mongoose.model<AuthCodeModel>("AuthCodeModel", AuthCodeSchema);

export default AuthCodeModel;