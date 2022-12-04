import React from "react"
import { useContacts } from '../../contexts/chat/ContactsProvider'
import { ListGroup } from "react-bootstrap"

export default function Contacts() {
    const { Contacts } = useContacts()

    return (
        <ListGroup varient = "flush">
            {Contacts.map(contact => (
                <ListGroup.Item k = {contact.ID}>
                    {contact.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}