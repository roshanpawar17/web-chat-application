import { myAxios } from "./Helper";

export const userLogin = async (values)=>{
    return await myAxios.post("/login/userlogin", values)
} 