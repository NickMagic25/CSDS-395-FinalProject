import {BrowserRouter, Router, Routes, Route} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
<<<<<<< HEAD
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  
  return (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path='/' element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>

    );
    
  
=======
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from './Navbar';
import Register from './Components/registerPage/register';
import Login from './Components/loginPage/login';
import About from './pages/About';
import HomePage from './pages/HomePage';
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="container">
      <Route path="/" exact component ={HomePage} ></Route>
      <Route path="/register" exact component={Register}></Route>
      <Route path="/login" exact component={Login}></Route>
      </div>
    </Router>
    </Provider>
  )
>>>>>>> main
}

export default App;
