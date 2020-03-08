import Client, {ClientInterface} from "../models/client";

interface ClientDataEntityResponse {
    error: any,
    results?: ClientInterface[]
}

const findAllClients = async () =>{
    try {
        const result = await Client.find()?.lean();
        return <ClientDataEntityResponse>{error: undefined, results:result};
    }catch(err){
        return <ClientDataEntityResponse>{error: err, results:undefined};
    }
    
};

interface ClientResult {
    error: any,
    result?: ClientInterface
}

const findClientByClientId = async (clientId: string) =>{
    try {
        const clientData = await Client.findOne({
            clientId: clientId
        }, {}, {
            lean: true
        });
        return <ClientResult>{
            result: clientData
        };
    }catch(error){
        return <ClientResult>{
            error: error
        }
    }
};

const findClientById = async(clientId: string) =>{
  try{
      const result = await Client.findById(clientId)?.lean();
      return <ClientResult>{
        error: undefined,
        result: result  
      };
  }catch (error) {
      return <ClientResult>{
          error: error,
          result: undefined
      }
  }
};

const saveClient = async (clientData:ClientInterface) =>{
    try {
        const savedResult = await findAllClients();
        if(savedResult.error){
            return <ClientResult>{
                error:savedResult.error
            }
        }
        else if(savedResult.results && savedResult.results.length){
            clientData.userId = savedResult.results.length + 1;
        }
        const result = await clientData.save();
        return <ClientResult>{
            result: result
        }
    }catch (error) {
        return <ClientResult>{
            error: error
        }
    }  
};

module.exports = {
  findAllClients,
  saveClient  
};