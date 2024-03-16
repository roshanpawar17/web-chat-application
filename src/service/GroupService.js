import { myAxios } from "./Helper"

export const createGroup = async (values)=>{
    return await myAxios.post("/groups/creategroup", values)
}

export const getGroups = async ()=>{
    return await myAxios.get("/groups/getgroups")
}

export const updateGroup = async (editableGroupData)=>{
    return await myAxios.put("/groups/updategroup", editableGroupData)
}

export const deleteGroup = async (groupId)=>{
    return await myAxios.delete("/groups/deletegroup", {data: {id: groupId}} )
}

export const addUsersInGroup = async (selectedAddUser)=>{
    return await myAxios.post("/groups/addusersingroup", selectedAddUser)
}

export const updateGroupData = async ()=>{
    return await myAxios.put("/groups/updategroup")
}

