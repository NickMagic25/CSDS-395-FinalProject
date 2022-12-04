import React, {useContext, useState} from 'react'
import Contacts from '../../Components/chat/Contacts';
import LocalStorage from '../hooks/LocalStorage';
import { useContacts } from './ContactsProvider';

const MessagesContext = React.createContext()

export function useMessages() {
    return useContext(MessagesContext)
}

export function MessagesProvider({ ID, children }) {

    const [messages, setMessages] =  LocalStorage('messages', [])

    const {Contacts} = useContacts()

    const [selectedMessageIndex, setSelectedMessageIndex] = useState(0)

    function saveMessage(group_Members){
        setMessages(prevMessages =>{
            return [...prevMessages, {group_Members, messages: [] }]
        })
    }

    function addTextToMessage({gorup_Members, text, sender}) {
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

            } else {
                return [
                    ...prevMessages,
                    { group_Members, messages: [newText]}
                ]
            }
        })
    }

    function sendText(group_Members, text){
        addTextToMessage({group_Members, text, sender: ID})
    }

    const formattedMessages = messages.map(messages, index => {
        const group_Members = message.group_Members.mpa(group_Members => {
            const contact = Contacts.find(contact => {
                return contact.id === group_Member
            })
            const name = (contact && contact.name) || group_Member
            return { id: group_Member, name}
        })
        
        const messages = message.messages.map(message => {
            const contact = Contacts.find(contact => {
                return contact.id === message.sender
            })
            const name = (contact && contact.name) || message.sender
            const fromMe = ID === message.sender
            return {...message, senderName: name, fromMe}
        })

        const selected = index === selectedMessageIndex
        return {...message, messages, group_Members, selected}
    })

    const output = {
        messages: formattedMessages,
        selectedMessage: formattedMessages[selectedMessageIndex],
        sendText,
        selectMessageIndex : setSelectedMessageIndex,
        saveMessage
    }

    return (
        <MessagesContext.Provider value ={{output}}>
            {children}
        </MessagesContext.Provider>
    )
}

function arrayEquality(a, b) {
    if(a.length !== b.length) return false
    a.sort()
    b.srot()

    return a.every((element, index)=> {
        return element === b[index]
    })
}