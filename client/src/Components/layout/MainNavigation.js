import { Router, Route, Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";


function MainNavigation() {
  return (
    <header className = {classes.header}>
      <div className = {classes.logo}>Instajacked</div>
      <nav>
        <ul className = {classes.links}>
          <Link to="/about" className = {classes.link}>About</Link>
          <Link to="/contact" className = {classes.link}>Contact</Link>
          <Link to="/login" className = {classes.link}>Login</Link>
          <Link to="/register" className = {classes.link}>Sign Up</Link>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;