import { myAxios } from "./Helper";

export const searchResult = async (query)=>{
    return await myAxios.get(`/user/searchuser?q=${query}`);
}