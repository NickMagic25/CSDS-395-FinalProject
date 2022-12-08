import React from 'react'
import { useMessages } from '../../contexts/chat/MessagesProvider'
import OpenMessage from './OpenMessage'
import SideBar from './SideBar'
import Navbar from '../navbar/Navbar'

export default function Dashboard({ id }) {
    
    const { selectedMessage } = useMessages()
    
    return (
        <>
        <Navbar/>
            <div className = "d-flex" style = {{ height: '100vh' }}>
                <SideBar id = {id} />
                {selectedMessage && <OpenMessage />}
            </div>
        </>
    )
}
