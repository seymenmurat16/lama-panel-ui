import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import "./user.scss"
import UserList from '../../components/userList/UserList'

const users = () => {
    return (
        <div className='user'>
            <Sidebar />
            <div className='userContainer'>
                <Navbar></Navbar>
                <UserList></UserList>
            </div>
        </div>
    )
}

export default users