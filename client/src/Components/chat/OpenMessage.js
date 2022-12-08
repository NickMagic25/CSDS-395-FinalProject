import React, { useState, useCallback } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useMessages } from '../contexts/MessagesProvider'

export default function OpenMessage() {
    
    const [text, setText] = useState('')

    const {sendText, selectedMessage} = useMessages()


    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true})
        }
    }, [])

    function handleSubmit(a) {
        a.preventDefault()

        sendText(
            selectedMessage.group_Members.map(m => m.id),
            text
        )
        setText('')
    }

    return (
        <div className = "d-flex flex-column flex-grow-1">
            <div className="flex-grow-1 overflow-auto">
                <div className = "d-flex flex-column align-items-start justify-content-end px-3">
                    {selectedMessage.messages.map((message, index)=> {
                        const lastText = selectedMessage.messages.length - 1 === index
                        return (
                            <div
                                ref={lastText ? setRef: null}
                                key={index}
                                className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'} `}
                            >
                                <div 
                                    className={`rounded px-2 py-1 ${message.fromMe ? 'bg-primary text-white': 'border'}`}>
                                    {message.text}
                                </div>
                                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                                    {message.fromMe ? 'You' :message.senderName}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Form onSubmit={handleSubmit} >
                <Form.Group className="m-2">
                    <InputGroup>
                        <Form.Control 
                            as="textarea"
                            required
                            value={text}
                            onChange={a => setText(a.target.value)}
                            style={{height: '75px', resize: 'none' }}
                        />
                        <Button type="submit">Send</Button>
                    </InputGroup>
                </Form.Group>
            </Form>
    </div>
    )
}

/*
<InputGroup.Append>
                        <Button type="submit">Send</Button>                    
                    </InputGroup.Append>
                    */