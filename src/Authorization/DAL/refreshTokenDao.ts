import RefreshTokenModel, {RefreshTokenInterface} from '../models/refreshTokenModel';

interface RefreshTokenResults{
    error: any,
    refreshToken?: RefreshTokenInterface
}

const saveRefreshToken = async(refreshToken: RefreshTokenInterface) =>{
    try{
        const savedResults = await refreshToken.save();
        return <RefreshTokenResults>{
            refreshToken: savedResults
        }
    }catch(error){
        return <RefreshTokenResults>{
            error: error
        }
    }
};

module.exports = {
    saveRefreshToken
}