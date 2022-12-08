import React from 'react'
import { useMessages } from '../contexts/MessagesProvider'
import OpenMessage from './OpenMessage'
import SideBar from './SideBar'

export default function Dashboard({ id }) {
    
    const { selectedMessage } = useMessages()
    
    return (
        <div className = "d-flex" style = {{ height: '100vh' }}>
            <SideBar id = {id} />
           {selectedMessage && <OpenMessage />}
        </div>
    )
}