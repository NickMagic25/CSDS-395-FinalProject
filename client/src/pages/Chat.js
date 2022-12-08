import React from 'react'
import Login from './Login'
import LocalStorage from '../../src/hooks/LocalStorage';
import Dashboard from '../Components/chat/Dashboard'
import {ContactsProvider} from '../../src/contexts/chat/ContactsProvider';
//import SideBar from './components/SideBar';
// import "bootstrap/dist/css/bootstrap.min.css";
import { MessagesProvider } from '../../src/contexts/chat/MessagesProvider';
import {SocketProvider} from '../../src/contexts/chat/SocketProvider'

function Chat() {
  const [id, setId] = LocalStorage('id')

  const dashboard = (
  <SocketProvider id={id}>
    <ContactsProvider>
      <MessagesProvider id={id}>
      <Dashboard id={id} />
      </MessagesProvider>
    </ContactsProvider>
  </SocketProvider>
  )

  return (
    id !== 'undefined' && id != null ? dashboard : 
   <Login onIdSubmit={setId} />
   
  )
}

export default Chat;