import React, {useState} from 'react'
import {Form, InputGroup, Button} from 'react-bootstrap'
import { useMessages, selectedMessage } from '../contexts/MessagesProvider'

export default function OpenMessage() {
    
    const [text, setText] = useState('')

    const {sendMessage} = useMessages()

    function handleSubmit(a) {
        a.preventDefault()

        sendMessgae(
            selectedMessage.group_Members.map(m => m.ID),
            text
        )
        setText('')
    }

    return (
        <div className = "d-flex flex-column flex-grow-1">
            <div className="flex-grow-1 overflow-auto">
                <div className = "h-100 d-flex flex-column align-items-start justy-content-end px-3">
                    {selectedMessage.messages.map((message, index))
                    => {
                        return (
                            <div
                                key={index}
                                className="my-1 d-flex flex-column"
                            >
                                <div 
                                    className={'rounded px-2 py-1 ${message.fromMe ? 'bd-primary text-white'}'}>
                                    {message.text}
                                </div>
                                <div>
                                    {message.fromMe ? 'You' :message.senderName}
                                </div>
                            </div>
                        )
                    }}
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
                        <InputGroup.Append>
                            <Button type="submit">Send</Button>                    
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    )
}