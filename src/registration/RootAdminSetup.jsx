import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormGroup, Input, FormFeedback } from "reactstrap";

import { adminSetup, getroot } from '../service/RootAdminService';
import { generateFourDigitRandomNumber } from '../service/GenerateNumber';

function RootAdminSetup() {

    const navigate = useNavigate()

    useEffect(() => {
        getroot().then((res) => {
            console.log(res)
            setResponseData(res.data)
            res.data.map((r) => {
                console.log(r.setupcomplete)
                if(r.setupcomplete === true){
                    navigate("/login")
                }
            })
        })
    }, [])

    const [responseData, setResponseData] = useState([])
    const [rootAdmitData, setRootAdmitData] = useState({
        rid: 'tcra' + generateFourDigitRandomNumber(),
        rname: '',
        remail: '',
        rpassword: '',
        role: 'root_admin',
        setupcomplete: 'true'
    })


    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setRootAdmitData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (responseData.length === 1) {
                alert("Yor are not access to register as a root user ")
            }else{
                const response = await adminSetup(rootAdmitData);
                if (response.status === 200) {
                    setTimeout(() => {
                        alert('Registration successfully! ', response.data.remail)
                        navigate('/login')
                    }, 1000)
                }
                console.log(response);
            }

        } catch (error) {
            console.error('Error creating root admin:', error);
        }
    };

    return (
        <section className='root-admin-setup-section'>
            <div className="container-a">
                <h2>Setup Root Admin</h2>
                <p>{rootAdmitData.rid}</p>
                <p>{rootAdmitData.rname}</p>
                <p>{rootAdmitData.remail}</p>
                <p>{rootAdmitData.rpassword}</p>
                <p>{rootAdmitData.role}</p>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label htmlFor="name">Enter Name</label><br />
                        <Input
                            type="text"
                            // value={values.email}
                            name='rname'
                            onChange={handleChange}
                            // onBlur={handleBlur}
                            placeholder="Name"
                            id='rname'
                            value={rootAdmitData.rname}
                            required
                        // invalid={errors.email && touched.email ? true : false}
                        // valid={values.email ? true : false}
                        />
                        {/* {errors.email && touched.email ? <FormFeedback>{errors.email}</FormFeedback> : null} */}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="remail">Enter Email</label><br />
                        <Input
                            type="email"
                            // value={values.email}
                            name='remail'
                            onChange={handleChange}
                            // onBlur={handleBlur}
                            placeholder="Email"
                            id='remail'
                            value={rootAdmitData.remail}
                            required
                        // invalid={errors.email && touched.email ? true : false}
                        // valid={values.email ? true : false}
                        />
                        {/* {errors.email && touched.email ? <FormFeedback>{errors.email}</FormFeedback> : null} */}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="rpassword">Enter Password</label><br />
                        <Input
                            type="password"
                            // value={values.email}
                            name='rpassword'
                            onChange={handleChange}
                            // onBlur={handleBlur}
                            placeholder="Password"
                            id='rpassword'
                            value={rootAdmitData.rpassword}
                            required
                        // invalid={errors.email && touched.email ? true : false}
                        // valid={values.email ? true : false}
                        />
                        {/* {errors.email && touched.email ? <FormFeedback>{errors.email}</FormFeedback> : null} */}
                    </FormGroup>

                    <button className="btn btn-success" >Register</button>
                </form>


            </div>
        </section>
    )
}

export default RootAdminSetup
