import React from 'react'
import { Route, Routes, NavLink } from 'react-router-dom'

import Home from '../Home'

import UserLogin from '../login/UserLogin'
import AdminLogin from '../login/AdminLogin'

import RootAdminSetup from '../registration/RootAdminSetup'

import RootAdminPanel from '../admincomponent/RootAdminPanel'
import Dashboard from '../admincomponent/Dashboard'
import Create from '../admincomponent/Create'
import Groups from '../admincomponent/Groups'

import TechConnectChatPanel from '../chatappcomponent/TechConnectChatPanel'

function Navigate() {

    return (
        <div>            
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/login' element={<UserLogin />} />                
                <Route exact path='/chatpanel' element={<TechConnectChatPanel />} />             
                <Route exact path='/rootadminsetup' element={<RootAdminSetup />} />            
                <Route exact path='/rootadminpanel' element={<RootAdminPanel />}>
                    <Route exact path='dashboard' element={<Dashboard/>} />
                    <Route exact path='users' element={<Create/>} />
                    <Route exact path='groups' element={<Groups/>} />
                </Route>  
            </Routes>
            
        </div>
    )
}

export default Navigate
