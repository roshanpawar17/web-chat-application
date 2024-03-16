import { myAxios } from "./Helper"

export const sendOTP = (email) =>{
    return myAxios.post("/otp/sendotp", email)
} 

export const verifyOtp = (otp) =>{
    return myAxios.post("/otp/verifyotp", otp)
}

