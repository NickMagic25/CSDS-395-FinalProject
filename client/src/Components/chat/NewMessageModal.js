import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useMessages } from '../contexts/MessagesProvider'

export default function NewMessageModal({closeModal}) {
    
    const [selectedContactIDs, setSelectedContactIDs] = useState([])

    const { contacts } = useContacts()

    const {createMessage} = useMessages()

    function handleSubmit(a) {
        a.preventDefault()

        createMessage(selectedContactIDs)
        closeModal()
    }

    function handleCheckboxChange(contact_ID) {
        setSelectedContactIDs(previousSelectedContactIDs => {
            if (previousSelectedContactIDs.includes(contact_ID)) {
                return previousSelectedContactIDs.filter(prev_ID => {
                    return contact_ID !== prev_ID
                })
            } else{
                return [...previousSelectedContactIDs, contact_ID]
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
                        <Form.Group control_ID = {contact.id} key = {contact.id}>
                            <Form.Check 
                                type = "checkbox"
                                value = {selectedContactIDs.includes(contact.id)}
                                label = {contact.name}
                                onChange = {() => handleCheckboxChange(contact.id)}
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