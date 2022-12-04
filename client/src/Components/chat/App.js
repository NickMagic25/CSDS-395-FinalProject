import React from 'react'
import Login from './Login'
import LocalStorage from '../hooks/LocalStorage';
import Dashboard from './Dashboard';
import {ContactsProvider} from '../contexts/ContactsProvider';
//import SideBar from './components/SideBar';
import "bootstrap/dist/css/bootstrap.min.css";
import { MessagesProvider } from '../contexts/MessagesProvider';

function App() {
  const [ID, set_ID] = LocalStorage('ID')

  const dashboard = (
  <ContactsProvider>
      <MessagesProvider ID = {ID}>
      <Dashboard ID = {ID} />
      </MessagesProvider>
  </ContactsProvider>
  )

  return (
    ID ? dashboard : <Login onIDSubmit = {set_ID} />
  )
}

export default App;
