import React, {useEffect, useState} from 'react'

import logo from "./Images/logo.gif"

import "./Home.css"
import { useNavigate } from 'react-router-dom'

import { getroot } from './service/RootAdminService'

function Home() {

    useEffect(() => {
        getRootRes(); // Call getRoot function when the component mounts
    }, []);

    const navigate = useNavigate(); 

    const [isSetupComplete, setIsSetupComplete] = useState(false);

    function navigateToAdminSetup(){
        navigate("/rootadminsetup")
    }
    function navigateToLogin(){
        navigate("/login")
    }

    function getRootRes(){
        getroot().then((res)=>{
            res.data.map((r)=>{
                console.log(r.setupcomplete)
                setIsSetupComplete(r.setupcomplete)
            })
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }

    document.title = "TechCorp - TechConnect"


    return (
        <section className='home-section'>
            <h2>Techconnect</h2> <br />
            <img src={logo} alt="logo" /> <br />
            {
                    !isSetupComplete ? <button className='btn btn-secondary' onClick={navigateToAdminSetup}>Get Started</button>
                            : <button className='btn btn-secondary' onClick={navigateToLogin}>Get Started</button>

            }
            <br />
            <h6><span>*</span> It's Only Use For Company Member Staff</h6>
        </section>
    )
}

export default Home
