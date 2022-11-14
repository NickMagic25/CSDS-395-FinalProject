import React, {useContext} from 'react'
// import Db from '../../../../server/src/db';

const ContactsContext = React.createContext()

export function useContacts() {
    return useContext(ContactsContext)
}

export function ContactsProvider({ children }) {

    // const [contacts] =  Db.getContacts() 

    return (
        <ContactsContext.Provider value ={{contacts}}>
            {children}
        </ContactsContext.Provider>
    )
}