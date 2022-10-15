import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";


function MainNavigation() {
  return (
    <header className = {classes.header}>
      <div className = {classes.logo}>Instajacked</div>
      <nav>
        <ul className>
          <li>About</li>
          <li>Contact</li>
          <li>Login</li>
          <li>Sign Up</li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;