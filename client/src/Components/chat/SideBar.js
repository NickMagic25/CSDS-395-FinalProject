import React, { useState } from 'react'
import { Tab, Nav, Button, Modal } from 'react-bootstrap'
import Messages from './Messages'
import Contacts from './Contacts'
import NewMessageModal from './NewMessageModal'
import NewContactModal from './NewContactModal'

const messages_Key = 'messages'
const contacts_Key = 'contacts'
const username = localStorage.getItem('username')

export default function SideBar({ id }) {
    const [activeKey, setActiveKey] = useState(messages_Key)
    const messagesOpen = activeKey === messages_Key
    const [openModal, setOpenModal] = useState(false)

    function closeModal() {
        setOpenModal(false)
    }

    return (
        <div style = {{width: '250px' }} className = "d-flex flex-column">
            <Tab.Container activeKey = {activeKey} onSelect={setActiveKey}>
                <Nav variant = "tabs" className = "justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey = {messages_Key}>Messages</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = {contacts_Key}>Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className = "border-right overflow-auto flex-grow-1">
                    <Tab.Pane eventKey={messages_Key}>
                        <Messages />
                    </Tab.Pane>
                    <Tab.Pane eventKey={contacts_Key}>
                        <Contacts />
                    </Tab.Pane>
                </Tab.Content>
                <div className = "p-2 border-top border-right small">
                    Personal ID: <span className = "text-muted">{username}</span>
                </div>
                <Button onClick = {() => setOpenModal(true)} className = "rounded-0">
                    New {messagesOpen ? 'Message' : 'Contact'}
                </Button>
            </Tab.Container>

            <Modal show={openModal} onHide = {closeModal}>
                {messagesOpen ?
                    <NewMessageModal closeModal = {closeModal} />:
                    <NewContactModal closeModal = {closeModal} />
                }
            </Modal>
        </div>
    )
}