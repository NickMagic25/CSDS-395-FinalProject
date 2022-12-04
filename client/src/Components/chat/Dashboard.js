import React from 'react'
import { useMessages } from '../contexts/MessagesProvider'
import OpenMessage from './OpenMessage'
import SideBar from './SideBar'

export default function Dashboard({ ID }) {
    
    const {selectedMessage} = useMessages()
    
    return (
        <div className = "d-flex" style = {{ height: '100vh' }}>
            <SideBar ID = {ID} />
            {selectedMessage && <OpenMessage />}
        </div>
    )
}