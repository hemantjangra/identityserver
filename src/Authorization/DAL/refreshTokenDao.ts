import RefreshTokenModel, {RefreshTokenInterface} from '../models/refreshTokenModel';

interface RefreshTokenResults{
    error: any,
    refreshToken?: RefreshTokenInterface
}

const saveRefreshToken = async(refreshToken: RefreshTokenInterface) =>{
    try{
        const savedResuts = await refreshToken.save();
        return <RefreshTokenResults>{
            refreshToken: savedResuts
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