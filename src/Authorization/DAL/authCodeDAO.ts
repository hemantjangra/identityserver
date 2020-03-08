import AuthCodeModel, {AuthCodeInterface} from '../models/authCodeModel';

interface AuthCodeResults {
    error: any,
    authCode?: AuthCodeInterface
}

const saveAuthCode = async(authCode: AuthCodeInterface) =>{
  try{
      const result = await authCode.save();
      return <AuthCodeResults>{
          authCode: result
      }
  }  catch (error) {
      return <AuthCodeResults>{
          error: error
      }
  }
};

module.exports = {
  saveAuthCode  
};
