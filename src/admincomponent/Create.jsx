import React, { useEffect, useState } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup"

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { FormGroup, Input, FormFeedback } from "reactstrap";

import { generateFourDigitRandomNumber } from '../service/GenerateNumber';
import { addUser, getUsers, updateUsersData, deleteUser } from '../service/UserService';
import { formatDate } from '../service/utility';

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

function Create() {

  const [userData, setUserData] = useState([])
  const [editUserData, setEditUserData] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)

  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [wantDeleteUserInfo, setWantDeleteUserInfo] = useState({
    eid: ''
  })
  // const [deleteUserId, setDeleteUserId] = useState()


  const [showLoader, setShowLoader] = useState(true)

  const [eid, setEid] = useState()
  const [ename, setEname] = useState()
  const [eemail, setEemail] = useState()
  const [epassword, setEpassword] = useState()

  useEffect(() => {
    getUserData()
  },[])


  useEffect(() => {
    setEid(editUserData.eid)
    setEname(editUserData.ename)
    setEemail(editUserData.eemail)
    setEpassword(editUserData.epassword)
  },[editUserData])


  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);


  const initialValues = {
    eid: 'tce' + generateFourDigitRandomNumber(),
    ename: '',
    eemail: ''
    // erole: ''
  };

  const modifyUserData = {
    eid: eid,
    ename: ename,
    eemail: eemail,
    epassword: epassword,
    
  }
  

  function updateUserData(e){
    e.preventDefault()
    console.log(modifyUserData)
    updateUsersData(modifyUserData).then((res)=>{
      console.log(res)
      alert("Update Successful")
      getUserData()
    });
    // setEname('')
    // setEemail('')
    // setEpassword('')
    setShowEditModal(false)
  }

  const validationSchema = Yup.object({
    ename: Yup.string().min(2).required("Please enter Name"),
    eemail: Yup.string().email().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter valid email").required("please enter email"),
    // erole: Yup.string().required('Please select a login type')
  })

  const onSubmit = (values) => {
    addUser(values).then((response)=>{
      console.log(response)
      alert("Account created Successfully")
      getUserData()
    })
    setShowCreateUserModal(false)
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit
  })
  
  function getUserData(){
    getUsers().then((res) => {
      console.log(res)
      if (res.status === 200) {
          setShowLoader(false)
          setUserData(res.data)
      }
      
    })
  }

  function onEdit(user){
    console.log("Edit")
    setShowEditModal(true)
    console.log(user)
    setEditUserData(user)
  }

  function onDelete(user){
    console.log("delete")
    setShowDeleteUserModal(true)
    setWantDeleteUserInfo({
      eid: user.eid
    })
  }

  function handleDeleteEmployee(){
    console.log("deleted", wantDeleteUserInfo.eid)
    deleteUser(wantDeleteUserInfo.eid).then((res)=>{
      alert("Deleted Successfully")
      getUserData()
    })
    setShowDeleteUserModal(false)
  }

  return (
    <div className='users'>
      <h5>Users</h5>
      <hr />

      {/* show form to create user account */}
      <Button variant="dark" onClick={()=>setShowCreateUserModal(true)}>
        + Create User
      </Button>
              
      {/* crete user account modal */}
      <Modal show={showCreateUserModal} onHide={()=>setShowCreateUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Employee Account</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <FormGroup>
              <label htmlFor="uname">Enter Name</label><br />
              <Input
                type="text"
                name='ename'
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Name"
                id='uname'
                value={values.ename}

                invalid={errors.ename && touched.ename ? true : false}
                valid={values.ename ? true : false}
              />
              {errors.ename && touched.ename ? <FormFeedback>{errors.ename}</FormFeedback> : null}
            </FormGroup>
            <FormGroup>
              <label htmlFor="uemail">Enter Email</label><br />
              <Input
                type="email"
                name='eemail'
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                id='uemail'
                value={values.eemail}

                invalid={errors.eemail && touched.eemail ? true : false}
                valid={values.eemail ? true : false}
              />
              {errors.eemail && touched.eemail ? <FormFeedback>{errors.eemail}</FormFeedback> : null}
            </FormGroup>
            {/* <div className="select-role">
              <div className="form-check">
                <input type="radio" name="erole" id="radio1" onChange={handleChange} value="normal_user" />&nbsp;
                <label htmlFor="radio1">Employee</label>
              </div>
              <div className="form-check">
                <input type="radio" name="erole" id="radio2" onChange={handleChange} value="admin" />&nbsp;
                <label htmlFor="radio2">Admin</label>
              </div>
            </div>
            {errors.erole ? <p style={{ color: 'rgba(235, 48, 48, 0.952)', fontSize: '14px' }}>{errors.erole}</p> : null} */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShowCreateUserModal(false)}>
              Close
            </Button>
            <Button type="submit" variant="primary" >
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <hr />

       {/* edit user account modal      */}
      <Modal show={showEditModal} onHide={()=>setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee Account Details</Modal.Title>
        </Modal.Header>
        <form onSubmit={(e)=>updateUserData(e)}>
          <Modal.Body>
                    <FormGroup>
                      <label htmlFor="uname">Enter Name</label><br />
                      <Input
                        type="text"
                        name='ename'
                        // onChange={handleChange}
                        // onBlur={handleBlur}
                        placeholder="Name"
                        id='ename'
                        onChange={() => setEname(event.target.value)}
                        value={ename}
                        required
                        // invalid={errors.ename && touched.ename ? true : false}
                        // valid={values.ename ? true : false}
                      />
                      {/* {errors.ename && touched.ename ? <FormFeedback>{errors.ename}</FormFeedback> : null} */}
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="uemail">Enter Email</label><br />
                      <Input
                        type="email"
                        name='eemail'
                        // onChange={handleChange}
                        // onBlur={handleBlur}
                        placeholder="Email"
                        id='eemail'
                        onChange={() => setEemail(event.target.value)}
                        value={eemail}
                        required
                        // invalid={errors.eemail && touched.eemail ? true : false}
                        // valid={values.eemail ? true : false}
                      />
                      {/* {errors.eemail && touched.eemail ? <FormFeedback>{errors.eemail}</FormFeedback> : null} */}
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="epassword">Enter Password</label><br />
                      <Input
                        type="text"
                        name='epassword'
                        // onChange={handleChange}
                        // onBlur={handleBlur}
                        placeholder="Enter Password"
                        id='epassword'
                        onChange={() => setEpassword(event.target.value)}
                        value={epassword}
                        required
                        // invalid={errors.eemail && touched.eemail ? true : false}
                        // valid={values.eemail ? true : false}
                      />
                      {/* {errors.eemail && touched.eemail ? <FormFeedback>{errors.eemail}</FormFeedback> : null} */}
                    </FormGroup>


            
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose}>
              Close
            </Button> */}
            <Button type="submit" variant="primary" >
              Save Updates
            </Button>
          </Modal.Footer>
        </form>
      </Modal>     


      {/* display loader before data render */}
      {/* {showLoader?<h5>Loading...</h5>:null} */}

      {/* display users table */}
      {
        showLoader?<h5>Loading...</h5>:
        userData.length > 0  ? 
        <Table responsive="sm" className='table-bordered'>
        <thead>
          <tr style={{textAlign: "center", fontSize: "20px"}}>
            <th>No.</th>
            <th>User ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Date Of Joined</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            userData.map((user, i) => {
              return (
                <tr key={i} style={{textAlign: "center"}}>
                  <td>{i+1}</td>
                  <td>{user.eid}</td>
                  <td>{user.ename}</td>
                  <td>{user.eemail}</td>
                  <td>{formatDate(user.date_joined)}</td>
                  <td title='Edit' style={{ cursor: "pointer", fontSize: "25px", color: "blue" }} onClick={()=>onEdit(user)}><MdEdit /></td>
                  <td title='Delete' style={{ cursor: "pointer", fontSize: "25px", color: "red" }} onClick={()=>onDelete(user)}><MdDelete /></td>
                </tr>
              )
            })
          }

        </tbody>
      </Table>
            : <h2>Data Not Available</h2>

          
      }

      {/* confirmation delete employee modal */}
      <Modal
        size="sm"
        show={showDeleteUserModal}
        onHide={() => setShowDeleteUserModal(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            {wantDeleteUserInfo.eid}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure want to delete?</p>
        </Modal.Body>
        <Modal.Footer>
            <Button type="submit" variant="danger" onClick={()=>handleDeleteEmployee()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

    </div>

  )
}

export default Create
