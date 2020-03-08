import mongoose, {Schema, Document} from 'mongoose';
import v4 from 'uuid/v4';

export interface ClientInterface extends Document{
    _id: string,
    clientId?: string,
    clientSecret?: string,
    createdAt?: Date,
    name: string,
    scope: string,
    userId: number,
    redirectUri: string
}

const ClientSchema:Schema = new Schema({
    _id:{type: String, default: v4},
    clientId:{type: String, default: v4, unique: true},
    clientSecret:{type: String, default: v4, unique: true},
    createdAt:{type: Date, default: Date.now()},
    name:{type: String, unique: true, default:v4},
    scope:{type: String},
    userId:{type: Number, default:1, unique:true},
    redirectUri:{type: String}
},{_id:false});

const Client = mongoose.model<ClientInterface>("Client", ClientSchema);
export default Client;
