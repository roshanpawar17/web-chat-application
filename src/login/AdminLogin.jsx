import React from 'react'
import Navigator from '../component/Navigator'
import { FormGroup, Input, FormFeedback } from "reactstrap";

function AdminLogin() {
    return (
        <section className='adminlogin-section'>
            <Navigator /><br /><br />
            <div className="adminlogin-container container-a">
                <form>
                    <FormGroup>
                        <label htmlFor="email">Admin Email</label><br /><br />
                        <Input
                            type="email"
                            // value={values.email}
                            name='aemail'
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                            placeholder="Email"
                            id='aemail'
                        // invalid={errors.email && touched.email ? true : false}
                        // valid={values.email ? true : false}
                        />
                        {/* {errors.email && touched.email ? <FormFeedback>{errors.email}</FormFeedback> : null} */}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="password">Admin Password</label><br /><br />
                        <Input
                            type="password"
                            // value={values.password}
                            name='apassword'
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                            placeholder="Password"
                            id='apassword'
                        // invalid={errors.password && touched.password ? true : false}
                        // valid={values.password ? true : false}
                        />
                        {/* {errors.password && touched.password ? <FormFeedback>{errors.password}</FormFeedback> : null} */}
                    </FormGroup>

                    <button type="submit" className="btn btn-outline-info" style={{ fontWeight: 'bold' }}>Login Admin</button>
                </form>
            </div>
        </section>
    )
}

export default AdminLogin
