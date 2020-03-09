import TokenModel, {TokenModelInterface} from '../models/tokenModel';

interface TokenModelResponse{
    error: any,
    token?: TokenModelInterface
}

const saveToken = async(token: TokenModelInterface) => {
    try{
       const tokenSaveResult = await token.save();
       return <TokenModelResponse>{
           token: tokenSaveResult
       }
    }catch(error){
        return <TokenModelResponse>{
            error: error
        }
    }  
};

module.exports  = {
    saveToken
}