import React, {useContext} from 'react'
import LocalStorage from '../../hooks/LocalStorage';

const ContactsContext = React.createContext()
const username = localStorage.getItem('username')

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

async function getFriendsOfUser() {
    const req = await fetch('http://localhost:5000/api/allFriends/' + username, {
			headers: {
				'username': localStorage.getItem('username'),
			},
		})
    const data = await req.json()
    if (data.status === 'ok') {
        return data.friends
    } else {
        alert(data.error)
    }
    return [];
  }