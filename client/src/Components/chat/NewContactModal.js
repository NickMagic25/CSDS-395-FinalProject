import React, { useRef } from 'react'
import {Modal, Form, Button} from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

export default function NewContactModal({ closeModal }) {
    const id_Ref = useRef()
    const name_Ref = useRef()
    const { saveContact } = useContacts()

    function handleSubmit(a) {
        a.preventDefault()

        saveContact(id_Ref.current.value, name_Ref.current.value)
        closeModal()
    }

    return (
        <>
            <Modal.Header closeButton>
                Create New Contact
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit = {handleSubmit}>
                    <Form.Group>
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control type="text" ref={name_Ref} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            ID
                        </Form.Label>
                        <Form.Control type="text" ref={id_Ref} required/>
                    </Form.Group>
                    <Button type = "submit">
                        Save
                    </Button>
                </Form>
            </Modal.Body>
        </>
    )
}