import React, {useContext, useEffect, useState, useCallback} from 'react'
//import Contacts from '../components/Contacts';
import LocalStorage from '../hooks/LocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const MessagesContext = React.createContext()

export function useMessages() {
    return useContext(MessagesContext)
}

export function MessagesProvider({ ID, children }) {

    const [messages, setMessages] =  LocalStorage('messages', [])
    const [selectedMessageIndex, setSelectedMessageIndex] = useState(0)
    const {contacts} = useContacts()

    const socket = useSocket()

    function createMessage(group_Members){
       setMessages(prevMessages =>{
            return [...prevMessages, {group_Members, messages: [] }]
        })
    }

    const addTextToMessage = useCallback(({group_Members, text, sender}) => {
        setMessages(prevMessages => {
            let madeChange = false
            
            const newText = { sender, text}
            const newMessages = prevMessages.map(message => {
                if (arrayEquality(message.group_Members, group_Members))
                    {
                        madeChange = true
                        return {
                            ...message,
                            messages: [...message.messages, newText]
                        }    
                }

                return message
            })

            if (madeChange) {
                return newMessages
            } else {
                return [
                    ...prevMessages,
                    { group_Members, messages: [newText]}
                ]
            }
        })
    }, [setMessages] )

    useEffect(() => {
        if (socket == null) return
        socket.on('receive-message', addTextToMessage)
        return () => socket.off('receive-message')
    }, [socket, addTextToMessage])

    function sendText(group_Members, text){
        socket.emit('send-message', {group_Members, text})
        addTextToMessage({group_Members, text, sender: ID})
    }

    const formattedMessages = messages.map((message, index) => {
        const group_Members = message.group_Members.map(group_Member => {
            const contact = contacts.find(contact => {
                return contact.id === group_Member
            })
            const name = (contact && contact.name) || group_Member
            return { id: group_Member, name}
        })
        
        const messages = message.messages.map(message => {
            const contact = contacts.find(contact => {
                return contact.id === message.sender
            })
            const name = (contact && contact.name) || message.sender
            const fromMe = ID === message.sender
            return {...message, senderName: name, fromMe}
        })

        const selected = index === selectedMessageIndex
        return {...message, messages, group_Members, selected}
    })

    const value = {
        messages: formattedMessages,
        selectedMessage: formattedMessages[selectedMessageIndex],
        sendText,
        selectMessageIndex : setSelectedMessageIndex,
        createMessage
    }

    return (
        <MessagesContext.Provider value ={value}>
            {children}
        </MessagesContext.Provider>
    )
}

function arrayEquality(a, b) {
    if(a.length !== b.length) return false
    a.sort()
    b.sort()

    return a.every((element, index)=> {
        return element === b[index]
    })
}