import { myAxios } from "./Helper"

export const getChatPanelData = async (groupId, empId)=>{
    return await myAxios.post(`/chatpanel/paneldata?groupId=${groupId}&empId=${empId}`)
}

export const logOut = async (empId)=>{
    return await myAxios.put(`/chatpanel/logout?empId=${empId}`)
}