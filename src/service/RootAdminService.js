import { myAxios } from "./Helper";

export const adminSetup = async (rootadmindata)=>{
    return await myAxios.post("/rootadmin/setupaccount", rootadmindata)
}

export const getroot = () =>{
    return myAxios.get('/rootadmin/getroot');
}

export const rootlogin = async (values) =>{
    return await myAxios.post('/rootadmin/rootadminlogin', values)
}