import React, { useState, useEffect } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup"

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { FormGroup, Input, FormFeedback, Label } from "reactstrap";

import { getUsers, removeUserFromGroup  } from '../service/UserService';
import { createGroup, getGroups, updateGroup, deleteGroup, addUsersInGroup} from '../service/GroupService';
import { generateFourDigitRandomNumber } from '../service/GenerateNumber';
import { formatDate } from '../service/utility';


import { MdEdit, MdGroups2 } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineGroups2 } from "react-icons/md";

function Groups() {

    useEffect(() => {
        getUserData()
        getGroupData()
    }, [])


    const [groupsData, setGroupData] = useState([])
    const [userData, setUserData] = useState([])

    const [showLoader, setShowLoader] = useState(true)
    const [showGroupMembers, setShowGroupMembers] = useState(false)
    const [group, setGroup] = useState({
        gid: '',
        gname: ''
    })
    const [groupMembersUsers, setGroupMembersUsers] = useState([])
    const [editGroupData, setEditGroupData] = useState({})

    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false)
    const [wantDeleteGroupInfo, setWantDeleteGroupInfo] = useState({
      gid: '',
      users: []
    })

    const [showEditGroupModal, setShowEditGroupModal] = useState(false)
    const [show, setShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);

    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    // add user in the group after creating group
    const [selectedAddUserCheckboxes, setSelectedAddUserCheckboxes] = useState([]);
    const [selectedAddUserGroup, setSelectedAddUserGroup] = useState({
        gid: '',
        gname: ''
    });

    // create group data
    const [gname, setGname] = useState()
    const [gdname, setGdname] = useState()
    const [gtname, setGtname] = useState()

    // editable group data hooks
    const [gid, setGid] = useState()
    const [egname, setEGname] = useState()
    const [egdname, setEGdname] = useState()
    const [egtname, setEGtname] = useState()

    // add user in the group after creating group
    const [showAddUserModal, setShowAddUserModal] = useState(false)


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowGroupMembers = (group) => {
        setShowGroupMembers(true)
        setGroupMembersUsers(group.users)
        setGroup({
            gid: group.gid,
            gname: group.gname
        })
    }

    const validationSchema = Yup.object({
        gname: Yup.string().required("Please enter group name"),
        gdname: Yup.string().required("Please enter group deartment name"),
        gtname: Yup.string().required("Please enter group team name"),
        // selectedCheckboxes: Yup.array().required('Please select users.')
    })

    // create group data
    const groupData = {
        gid: "tcg" + generateFourDigitRandomNumber(),
        gname: gname,
        gdname: gdname,
        gtname: gtname,
        users: selectedCheckboxes.map(u => u.userId)
    };

    // editable group data
    const editableGroupData = {
        gid: gid,
        gname: egname,
        gdname: egdname,
        gtname: egtname,
    };

    // add user in the group after creating group
    const selectedAddUser = {
        gid: selectedAddUserGroup.gid,
        users: selectedAddUserCheckboxes.map(u => u.userId)
    }

    useEffect(() => {
        setGid(editGroupData.gid)
        setEGname(editGroupData.gname)
        setEGdname(editGroupData.gdname)
        setEGtname(editGroupData.gtname)
    }, [editGroupData])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("value ", groupData)
        if (selectedCheckboxes.length <= 1) {
            alert('Please select at least two user.');
            return;
        }
        createGroup(groupData).then((response) => {
            console.log(response)
            alert("Group created successfully")
            getGroupData()
        }).catch((error) => {
            console.log(error)
        })
        handleClose();
    }

    
    // useEffect(() => {
    //     initialValues.users = selectedCheckboxes 
    // }, [selectedCheckboxes]);

    // const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    //     initialValues: initialValues,
    //     validationSchema: validationSchema,
    //     onSubmit
    // })


    const handleCheckboxChange = (userId) => {
        console.log(userId)
        if (selectedCheckboxes.some(u => u.userId === userId)) {
            console.log("if")
            setSelectedCheckboxes(selectedCheckboxes.filter(u => u.userId !== userId)); // Remove user if already selected);
        } else {
            console.log("else")
            setSelectedCheckboxes(prevState => [...prevState, { "userId": userId }])
        }
    }

    // add user in the group after creating group
    const handleAddUserCheckboxChange = (userId) => {
        console.log(userId)
        if (selectedAddUserCheckboxes.some(u => u.userId === userId)) {
            console.log("if")
            setSelectedAddUserCheckboxes(selectedAddUserCheckboxes.filter(u => u.userId !== userId)); // Remove user if already selected);
        } else {
            console.log("else")
            setSelectedAddUserCheckboxes(prevState => [...prevState, { "userId": userId }])
        }
    }

    function getGroupData() {
        getGroups().then((res) => {
            console.log(res)
            if (res.status === 200) {
                setShowLoader(false)
                setGroupData(res.data)
            }

        })
    }

    function getUserData() {
        getUsers().then((res) => {
            console.log(res)
            if (res.status === 200) {
                setShowLoader(false)
                setUserData(res.data)
            }

        })
    }


    console.log(selectedCheckboxes)

    function isUserPresent(users, user) {
        const getUser = users.find((u) => u.eid === user.eid)
        // console.log(getUser)
        return getUser
    }

    function checkUserPresentInGroup(user) {
        for (const group of groupsData) {
            if (isUserPresent(group.users, user)) {
                return true; // User found in existing group
            }
        }
    }

    function onEdit(group) {
        console.log("Edit")
        setShowEditGroupModal(true)
        console.log(group)
        setEditGroupData(group)
    }

    const updateGroupData = (e) => {
        e.preventDefault()
        console.log(editableGroupData)
        updateGroup(editableGroupData).then((res)=>{
            console.log(res)
            alert("Group Data Updated Successfully")
            getGroupData()
        })
        setShowEditGroupModal(false)
    }


    function onDelete(group) {
        console.log("delete")
        setShowDeleteGroupModal(true)
        setWantDeleteGroupInfo({
            gid: group.gid,
            users: group.users
        })
    }

    function handleDeleteGroup(){
        if(wantDeleteGroupInfo.users.length > 0){
            alert("First remove all users from group")
        }else{
            console.log("deleted ", wantDeleteGroupInfo.gid)
            deleteGroup(wantDeleteGroupInfo.gid).then((res)=>{
                alert("Deleted Successfully")
                getGroupData()
            })
            setShowDeleteGroupModal(false)  
        }
    }

    // add user in the group after creating group - open modal
    function handleAddUsers(group){
        setShowAddUserModal(true);
        setSelectedAddUserGroup({
            gid: group.gid,
            gname: group.gname
        })
    }

    // add user in the group after creating group
    function handleAddUsersInGroup(){
        if (selectedAddUserCheckboxes.length <= 0) {
            alert('Please select user.');
            return;
        }
        console.log(selectedAddUser)
        addUsersInGroup(selectedAddUser).then((res)=>{
            console.log(res)
            alert("Users added successfully")
            getGroupData()
            getUserData()
        })
        setShowAddUserModal(false);
    }

    //remove user from group
    function removeUser(user){
        console.log(user)
        removeUserFromGroup(user.eid).then((res)=>{
            console.log(res)
            alert("Remove successfully")
            getUserData()
            getGroupData()
        })
        setShowGroupMembers(false)
    }


    return (
        <div className='groups'>
            <h5>Groups</h5>
            <hr />

            {/* show form to create user account */}
            <Button variant="dark" onClick={handleShow}>
                + Create Chat Room
            </Button>

            {/* create groups modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group</Modal.Title>
                </Modal.Header>
                {/* <p>{groupData.gid}</p>
                <p>{groupData.gdname}</p>
                <p>{groupData.gname}</p>
                <p>{groupData.gtname}</p> */}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Modal.Body>
                        <FormGroup>
                            <label htmlFor="gname">Chat Room Name</label><br />
                            <Input
                                type="text"
                                name='gname'
                                onChange={() => setGname(event.target.value)}
                                // onBlur={handleBlur}
                                placeholder="Group Name"
                                id='gname'
                                value={gname}
                                required
                            // invalid={errors.gname && touched.gname ? true : false}
                            // valid={values.gname ? true : false}
                            />
                            {/* {errors.gname && touched.gname ? <FormFeedback>{errors.gname}</FormFeedback> : null} */}
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="gdname">Department Name</label><br />
                            <Input
                                type="text"
                                name='gdname'
                                onChange={() => setGdname(event.target.value)}
                                // onBlur={handleBlur}
                                placeholder="Department"
                                id='gdname'
                                value={gdname}
                                required
                            // invalid={errors.gdname && touched.gdname ? true : false}
                            // valid={values.gdname ? true : false}
                            />
                            {/* {errors.gdname && touched.gdname ? <FormFeedback>{errors.gdname}</FormFeedback> : null} */}
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="gtname">{`Team Name `}</label><br />
                            <Input
                                type="text"
                                name='gtname'
                                onChange={() => setGtname(event.target.value)}
                                // onBlur={handleBlur}
                                placeholder="Team"
                                id='gtname'
                                value={gtname}
                                required
                            // invalid={errors.gtname && touched.gtname ? true : false}
                            // valid={values.gtname ? true : false}
                            />
                            {/* {errors.gtname && touched.gtname ? <FormFeedback>{errors.gtname}</FormFeedback> : null} */}
                        </FormGroup>
                        <Button onClick={() => setLgShow(true)}> Select Users </Button>
                        <div className="selected-users-cont">
                            {
                                selectedCheckboxes.map((uid, i) => {
                                    return (
                                        <div key={i} >
                                            <p className='selected-users'>{uid.userId}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary" >
                            Create
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* edit group details modal */}
            <Modal show={showEditGroupModal} onHide={() => setShowEditGroupModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Group Details</Modal.Title>
                </Modal.Header>
                {/* <p>{groupData.gid}</p>
                <p>{groupData.gdname}</p>
                <p>{groupData.gname}</p>
                <p>{groupData.gtname}</p> */}
                <form onSubmit={(e) => updateGroupData(e)}>
                    <Modal.Body>
                        <FormGroup>
                            <label htmlFor="gname">Chat Room Name</label><br />
                            <Input
                                type="text"
                                name='gname'
                                onChange={() => setEGname(event.target.value)}
                                // onBlur={handleBlur}
                                placeholder="Group Name"
                                id='gname'
                                value={egname}
                                required
                            // invalid={errors.gname && touched.gname ? true : false}
                            // valid={values.gname ? true : false}
                            />
                            {/* {errors.gname && touched.gname ? <FormFeedback>{errors.gname}</FormFeedback> : null} */}
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="gdname">Department Name</label><br />
                            <Input
                                type="text"
                                name='gdname'
                                onChange={() => setEGdname(event.target.value)}
                                // onBlur={handleBlur}
                                placeholder="Department"
                                id='gdname'
                                value={egdname}
                                required
                            // invalid={errors.gdname && touched.gdname ? true : false}
                            // valid={values.gdname ? true : false}
                            />
                            {/* {errors.gdname && touched.gdname ? <FormFeedback>{errors.gdname}</FormFeedback> : null} */}
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="gtname">{`Team Name `}</label><br />
                            <Input
                                type="text"
                                name='gtname'
                                onChange={() => setEGtname(event.target.value)}
                                // onBlur={handleBlur}
                                placeholder="Team"
                                id='gtname'
                                value={egtname}
                                required
                            // invalid={errors.gtname && touched.gtname ? true : false}
                            // valid={values.gtname ? true : false}
                            />
                            {/* {errors.gtname && touched.gtname ? <FormFeedback>{errors.gtname}</FormFeedback> : null} */}
                        </FormGroup>
                        {/* <Button onClick={() => setLgShow(true)}> Select Users </Button>
                        <div className="selected-users-cont">
                            {
                                selectedCheckboxes.map((uid, i) => {
                                    return (
                                        <div key={i} >
                                            <p className='selected-users'>{uid.userId}</p>
                                        </div>
                                    )
                                })
                            }
                        </div> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary" >
                            Save Updates
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* select users in the group - modal */}
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Select Users
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>Date Of Joined</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                userData.map((user, i) => {
                                    // console.log(checkUserPresentInGroup(user), user)
                                    if (!checkUserPresentInGroup(user)) {
                                        return (
                                            <tr key={i}>
                                                {/* <td><FormGroup check > */}
                                                <td><Input type="checkbox"
                                                    onChange={() => handleCheckboxChange(user.eid)}
                                                    checked={selectedCheckboxes.some(u => u.userId === user.eid)}
                                                /></td>
                                                {/* <Label check>
                                                                    Some input
                                                                </Label>
                                                            </FormGroup></td> */}
                                                <td>{user.eid}</td>
                                                <td>{user.ename}</td>
                                                <td>{user.eemail}</td>
                                                <td>{formatDate(user.date_joined)}</td>
                                            </tr>
                                        );

                                    }


                                })
                            }

                        </tbody>
                    </Table>

                </Modal.Body>
            </Modal>

            <hr />

            {/* display groups table  */}
            {
                showLoader ? <h5>Loading...</h5> :
                    groupsData.length > 0 ?
                        <Table responsive="sm" className='table-bordered'>
                            <thead>
                                <tr style={{ textAlign: "center", fontSize: "20px" }}>
                                    <th>No.</th>
                                    <th>Group ID</th>
                                    <th>Group Name</th>
                                    <th>Group Department Name</th>
                                    <th>Group Team Name</th>
                                    <th colSpan={4}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    groupsData.map((group, i) => {
                                        return (
                                            <tr key={i} style={{ textAlign: "center" }}>
                                                <td>{i + 1}</td>
                                                <td>{group.gid}</td>
                                                <td>{group.gname}</td>
                                                <td>{group.gdname}</td>
                                                <td>{group.gtname}</td>
                                                <td title='Edit' style={{ cursor: "pointer", fontSize: "25px", color: "blue" }} onClick={() => onEdit(group)}><MdEdit /></td>
                                                <td title='Delete' style={{ cursor: "pointer", fontSize: "25px", color: "red" }} onClick={()=>onDelete(group)}><MdDelete /></td>
                                                <td title='Add User' style={{ cursor: "pointer", fontSize: "25px", color: "green" }} onClick={()=>handleAddUsers(group)}><IoMdPersonAdd /></td>
                                                <td title='Group Members' style={{ cursor: "pointer", fontSize: "25px" }} onClick={() => handleShowGroupMembers(group)}><MdOutlineGroups2 /></td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </Table>
                        : <h2>Data Not Available</h2>


            }

            {/* group members modal */}
            <Modal
                size="lg"
                show={showGroupMembers}
                onHide={() => setShowGroupMembers(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Group Members of {group.gname}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Table responsive="sm">

                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>Date Of Joined</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                groupMembersUsers.map((user, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{user.eid}</td>
                                            <td>{user.ename}</td>
                                            <td>{user.eemail}</td>
                                            <td>{formatDate(user.date_joined)}</td>
                                            <td><button type="button" className="btn btn-danger" onClick={()=>removeUser(user)}>Remove</button></td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>

                </Modal.Body>
            </Modal>

            {/* confirmation delete group - modal */}
            <Modal
                size="sm"
                show={showDeleteGroupModal}
                onHide={() => setShowDeleteGroupModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        {wantDeleteGroupInfo.gid}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure want to delete group?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="danger" onClick={() => handleDeleteGroup()}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* add user in the group after creating group - modal */}
            <Modal
                size="lg"
                show={showAddUserModal}
                onHide={() => setShowAddUserModal(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Add Users in {selectedAddUserGroup.gname}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>Date Of Joined</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                userData.map((user, i) => {
                                    // console.log(checkUserPresentInGroup(user), user)
                                    if (!checkUserPresentInGroup(user)) {
                                        return (
                                            <tr key={i}>
                                                {/* <td><FormGroup check > */}
                                                <td><Input type="checkbox"
                                                    onChange={() => handleAddUserCheckboxChange(user.eid)}
                                                    checked={selectedAddUserCheckboxes.some(u => u.userId === user.eid)}
                                                /></td>
                                                {/* <Label check>
                                                                    Some input
                                                                </Label>
                                                            </FormGroup></td> */}
                                                <td>{user.eid}</td>
                                                <td>{user.ename}</td>
                                                <td>{user.eemail}</td>
                                                <td>{formatDate(user.date_joined)}</td>
                                            </tr>
                                        );

                                    }


                                })
                            }

                        </tbody>
                    </Table>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="success" onClick={handleAddUsersInGroup}>
                        Add Users
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Groups
