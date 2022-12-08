import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../../contexts/chat/ContactsProvider'
import { useMessages } from '../../contexts/chat/MessagesProvider'

export default function NewMessageModal({closeModal}) {
    
    const [selectedContactIds, setSelectedContactIds] = useState([])

    const { contacts } = useContacts()

    const { createMessage } = useMessages()

    function handleSubmit(e) {
        e.preventDefault()

        console.log(createMessage);
        createMessage(selectedContactIds)
        closeModal()
    }

    function handleCheckboxChange(contactId) {
        setSelectedContactIds(previousSelectedContactIds => {
            if (previousSelectedContactIds.includes(contactId)) {
                return previousSelectedContactIds.filter(prev_ID => {
                    return contactId !== prev_ID
                })
            } else{
                return [...previousSelectedContactIds, contactId]
            }
        })
    }

    return (
        <>
            <Modal.Header closeButton>
                Create New Message
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit = {handleSubmit}>
                    {contacts.map(contact => (
                        <Form.Group controlId = {contact.ID} key = {contact.ID}>
                            <Form.Check 
                                type = "checkbox"
                                value = {selectedContactIds.includes(contact.ID)}
                                label = {contact.Name}
                                onChange = {() => handleCheckboxChange(contact.ID)}
                            />
                        </Form.Group>
                    ))}
                    <Button type = "submit">
                        Save
                    </Button>
                </Form>
            </Modal.Body>
        </>
    )
}