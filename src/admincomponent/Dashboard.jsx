import React,{useEffect, useState} from 'react'
import RootAdminPanel from './RootAdminPanel'
import Create from './Create'
import { Route, Routes, NavLink, Link, useNavigate } from 'react-router-dom'

import {BiUser} from "react-icons/bi";
import {RiAdminLine} from "react-icons/ri";
import {HiOutlineUserGroup} from "react-icons/hi";
import {FaRegCheckCircle} from "react-icons/fa";

import {countByRole} from '../service/UserService';

function Dashboard(){
    const [userCount, setUserCount] = useState(null);

    const userrole = {
        params: {
            role: 'normal_user'
        }
    }

    useEffect(() => {
        countByRole(userrole).then((res)=>{
            // console.log(res)
            setUserCount(res.data)
        }).catch((error)=>{
            console.error('Error fetching user count:', error);
        })
    })

    const navigate = useNavigate()
    return (
        <div className='dashboard'>
            <h5>Dashboard</h5>
            <hr />
            <div className="cards">
                <div className="card text-center border-secondary " style={{width: '18rem'}}>
                    <div className="card-body ">
                        <BiUser/>
                        <h5 className="card-title mt-3">Total Users</h5> <br />                      
                        {/* <p>{userCount}</p> */}
                        <p>5</p>
                        <Link to={"/rootadminpanel/users"}>View</Link>
                    </div>
                </div>
                <div className="card text-center border-secondary" style={{width: '18rem'}}>
                    <div className="card-body ">
                        <RiAdminLine/>
                        <h5 className="card-title mt-3">Total Admin</h5> <br />                      
                        <p>2</p>
                        <Link to={"/rootadminpanel/create"}>View</Link>
                    </div>
                </div>
                <div className="card text-center border-secondary" style={{width: '18rem'}}>
                    <div className="card-body ">
                        <HiOutlineUserGroup/>
                        <h5 className="card-title mt-3">Total Groups</h5> <br />                      
                        <p>2</p>
                        <Link to={"/rootadminpanel/groups"}>View</Link>
                    </div>
                </div>
                <div className="card text-center border-secondary" style={{width: '18rem'}}>
                    <div className="card-body ">
                        <FaRegCheckCircle />
                        <h5 className="card-title mt-3">Active Users</h5> <br />                      
                        <p>2</p>
                        <Link to={"/rootadminpanel/create"}>View</Link>
                    </div>
                </div>
                
                
            </div>
        </div>
    )
}

export default Dashboard
