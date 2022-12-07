import React, {useContext} from 'react'
import LocalStorage from '../hooks/LocalStorage';

const ContactsContext = React.createContext()

export function useContacts() {
    return useContext(ContactsContext)
}

export function ContactsProvider({ children }) {

    const [contacts, setContacts] =  LocalStorage('contacts', [])

    function saveContact(ID, Name){
        setContacts(prevContacts =>{
            return [...prevContacts, {ID, Name}]
        })
    }

    return (
        <ContactsContext.Provider value ={{contacts, saveContact}}>
            {children}
        </ContactsContext.Provider>
    )
}