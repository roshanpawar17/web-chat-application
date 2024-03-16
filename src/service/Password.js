import { myAxios } from "./Helper"

export const forgotPassword = (email)=>{
    return myAxios.post("/password/forgot-password", email)
}

export const resetPassord = ({ email, token, newPassword })=>{
    return myAxios.post("/password/reset-password", { email, token, newPassword });
}