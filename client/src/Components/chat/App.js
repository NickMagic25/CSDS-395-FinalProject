import React from 'react'
import Login from './Login'
import LocalStorage from '../hooks/LocalStorage';
import Dashboard from './Dashboard';
import {ContactsProvider} from '../contexts/ContactsProvider';
//import SideBar from './components/SideBar';
// import "bootstrap/dist/css/bootstrap.min.css";
import { MessagesProvider } from '../contexts/MessagesProvider';
import {SocketProvider} from '../contexts/SocketProvider'

function App() {
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

export default App;

