import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from './Navbar';
import Register from './Components/registerPage/register';
import Login from './Components/loginPage/login';
import About from './pages/About';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
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
        <Route path="/about" exact component={About}></Route>
        <Route path="/contact" exact component={Contact}></Route>

       
      
      </div>
    </Router>
    </Provider>
  )
}

export default App;
