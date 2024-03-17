import React, { useState, useEffect } from 'react'
import Navigator from '../component/Navigator'
import { useFormik } from "formik";
import * as Yup from "yup"
import { FormGroup, Input, FormFeedback } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { userLogin } from '../service/LoginService';
import { rootlogin } from '../service/RootAdminService';
import { getroot } from '../service/RootAdminService';

// import stompClient from '../service/WebSocket';

function UserLogin() {
    const navigate = useNavigate()
    // const { groupId } = useParams();
    const [showContent, setShowContent] = useState(false);
    const [error, SetError] = useState('')

    useEffect(() => {

        getroot().then((res)=>{
            // console.log(res)
        })
        let loginUser = JSON.parse(localStorage.getItem("loginuser"))
        let redirecturl = JSON.parse(localStorage.getItem("redirecturl"))
        if(loginUser){
            if(loginUser.role == "root_admin"){
                navigate('/rootadminpanel/dashboard')
            }else{
                navigate(redirecturl)
            }
        }else{
            navigate('/login')
        }

        // Function to show the content after 2 seconds
        const showContentTimeout = setTimeout(() => {
            setShowContent(true);
        }, 2000);

        // Function to hide the content after 4 seconds (2 seconds to show, and 2 seconds to hide)
        const hideContentTimeout = setTimeout(() => {
            setShowContent(false);
        }, 5000);

        // Clean up the timeouts when the component unmounts or the state changes
        return () => {
            clearTimeout(showContentTimeout);
            clearTimeout(hideContentTimeout);
        };
    }, [error]); // The empty dependency array ensures this effect runs only once on mount

    const initialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().email().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter valid email").required("please enter your email"),
        password: Yup.string().required("please enter Password")
    })

    const onSubmit = (values) => {
        if(navigator.onLine){

            userLogin(values).then((response)=>{
                console.log(response)
                if(response.status === 200){
                    alert("Login Successfully!")
                    if(response.data.role == "root_admin"){
                        localStorage.setItem("loginuser", JSON.stringify(response.data))
                        navigate('/rootadminpanel/dashboard')
                    }else{
                        console.log("loginemployee ", response.data.employee)
                        localStorage.setItem("loginuser", JSON.stringify(response.data.employee))
                        localStorage.setItem("redirecturl", JSON.stringify(response.data.redirectUrl))
                        // navigate(`/chatpanel?groupId=${groupId}`)
                        // stompClient.send('/app/login', {}, JSON.stringify({ userId: response.eid }));
                        navigate(response.data.redirectUrl)
                    }
                }else{
                    console.log(new Error("Something went wrong!"))
                    alert(new Error("Something went wrong!"))
                }
                
            }).catch((error)=>{
                if(error.response.status == 401){
                    alert(`${error.response.data}, please enter valid email and password` )
                }else if(error.response.status == 500){
                    alert( `Server error, please try again later.`);
                }
            })
        }else{
            alert("No Internet Connection")
        }
        // if (values.role === 'employee') {
        //     await userLogin(values).then((response) => {
        //         console.log(response.data)
        //         if (response.status === 200) {
        //             // const dataToAnotherComponent = {
        //             //     username: response.data
        //             // }
        //             setTimeout(() => {
        //                 navigate("/chatpanel")
        //             }, 3000)
        //         }
        //     })
        // } else if (values.role === 'root_admin') {
        //     try {
        //         const response = await rootlogin(values)
        //         console.log(response)
        //         const rootadmindata = {
        //             rid: response.data.rid,
        //             remail: response.data.remail,
        //             rpassword: response.data.rpassword,                    
        //             rname: response.data.rname,
        //             role: response.data.role
        //         }
        //         if (response.status === 200) {
        //             navigate("/rootadminpanel/dashboard", { state: rootadmindata })
        //         }
        //     } catch (err) {
        //         if (err.response.status === 401) {
        //             SetError(err.response.data)
        //         } else if (err.response.status === 400) {
        //             SetError(err.response.data)
        //         }

        //     }
        // }


    };

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit
    })



    document.title = "Techcorp - Login"

    return (
        <section className='userlogin-section'>
            <Navigator /> <br /><br />
            {showContent ? <p style={{ color: 'red' }}>{error}</p> : null}
            <div className="userlogin-container container-a">
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        {/* <label htmlFor="email">Email</label><br /><br /> */}
                        <Input
                            type="email"
                            value={values.email}
                            name='email'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Email"
                            id='email'
                            invalid={errors.email && touched.email ? true : false}
                            valid={values.email ? true : false}
                        />
                        {errors.email && touched.email ? <FormFeedback>{errors.email}</FormFeedback> : null}
                    </FormGroup>
                    <FormGroup>
                        {/* <label htmlFor="password">Password</label><br /><br /> */}
                        <Input
                            type="password"
                            value={values.password}
                            name='password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Password"
                            id='password'
                            invalid={errors.password && touched.password ? true : false}
                            valid={values.password ? true : false}
                        />
                        {errors.password && touched.password ? <FormFeedback>{errors.password}</FormFeedback> : null}
                    </FormGroup>
                    {/* <div className="select-role">
                        <div className="form-check">
                            <input type="radio" name="role" id="radio1" onChange={handleChange} value="employee" />&nbsp;
                            <label htmlFor="radio1">Employee</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="role" id="radio2" onChange={handleChange} value="root_admin" />&nbsp;
                            <label htmlFor="radio2">Admin</label>
                        </div>
                    </div>
                    {errors.role ? <p style={{ color: 'rgba(235, 48, 48, 0.952)', fontSize: '14px' }}>{errors.role}</p> : null}
                    <br /> */}
                    <button type="submit" className="btn btn-outline-info " style={{ fontWeight: 'bold' }}>Login</button>
                </form>
            </div>
        </section>
    )
}

export default UserLogin
