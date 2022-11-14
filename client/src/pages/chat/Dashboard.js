import React from 'react'
import SideBar from '../../Components/chat/SideBar'

export default function Dashboard({ ID }) {
    return (
        <div className = "d-flex" style = {{ height: '100vh' }}>
            <SideBar ID = {ID} />
        </div>
    )
}