import mongoose, {Schema, Document} from 'mongoose';
import v4 from 'uuid/v4';

export interface ClientInterface extends Document{
    clientId?: string,
    clientSecret?: string,
    createdAt?: Date,
    name: string,
    scope: string,
    userId: string,
    redirectUri: string
}

const ClientSchema:Schema = new Schema({
    clientId:{type: String, default: v4, unique: true},
    clientSecret:{type: String, default: v4, unique: true},
    createdAt:{type: Date, default: Date.now()},
    name:{type: String, unique: true},
    scope:{type: String},
    userId:{type: String},
    redirectUri:{type: String}
});

const Client = mongoose.model<ClientInterface>("Client", ClientSchema);
export default Client;
