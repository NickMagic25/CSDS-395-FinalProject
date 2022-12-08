import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useMessages } from '../contexts/MessagesProvider'
//import { useState} from 'react'

export default function Messages() {
    
    const { messages, selectMessageIndex } =  useMessages()
   
    return (
        <ListGroup variant = "flush">
            {messages && messages.map((message, index) => (
                <ListGroup.Item 
                    key = {index}
                    action
                    onClick = {() => selectMessageIndex(index)}
                    active={message.selected}
                >
                    {message.group_Members.map(r => r.name).join(', ')}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}