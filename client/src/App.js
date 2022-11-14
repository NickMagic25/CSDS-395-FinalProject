
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Register from './Components/registerPage/register';
import Login from './Components/loginPage/login';
import About from './pages/About';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import Dashboard from './pages/dashboard/Dashboard';
import Workout from './pages/workout/Workout';
import Chat from './pages/chat/Dashboard';
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";

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
        <Route path="/dashboard" exact component={Dashboard}></Route>
        <Route path="/workout" exact component={Workout}></Route>
        <Route path="/chat" exact component={Chat}></Route>
      
      </div>
    </Router>
    </Provider>
  )
}

export default App;
