import React from "react"
import { useContacts } from '../../contexts/chat/ContactsProvider'
import { ListGroup } from "react-bootstrap"

export default function Contacts() {
    const { contacts } = useContacts()

    return (
        <ListGroup variant = "flush">
            {contacts && contacts.map(contact => (
                <ListGroup.Item key = {contact.ID}>
                    {contact.Name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}