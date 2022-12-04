import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useMessages } from '../../contexts/chat/MessagesProvider'

export default function Messages() {
    
    const {messages, selectMessageIndex} = useMessages()

    return (
        <ListGroup varient = "flush">
            {messages.map((message, index) => (
                <ListGroup.Item 
                k = {index}
                action
                onClick = {() => selectMessageIndex(index)}
                active={message.selected}
                >
                    {message.group_Members.map(m => m.name).join(', ')}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}