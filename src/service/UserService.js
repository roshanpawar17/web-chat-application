import { myAxios } from "./Helper"

export const addUser = async (user)=>{
    return await myAxios.post("/user/adduser", user)
}

export const getUsers = ()=>{
    return myAxios.get("/user/getusers")
}

export const updateUsersData = async (modifyUserData)=>{
    return await myAxios.put("/user/updateuser", modifyUserData)
}

export const deleteUser = async (userId)=>{
    return await myAxios.delete("/user/deleteuser", {data: {id: userId}})
}

export const countByRole = (userrole)=>{
    return myAxios.get("/user/countByRole", userrole)    
}

export const removeUserFromGroup = async (eid)=>{
    return await myAxios.delete("/user/removeuser", {data: {id: eid}})
}