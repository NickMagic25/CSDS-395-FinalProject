import "./login.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import {FaUserCircle} from 'react-icons/fa';
import {RiLockPasswordFill} from "react-icons/ri";


class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errors: {},
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (localStorage.getItem('jwtToken') !== null) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (localStorage.getItem('jwtToken') !== null) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      username: this.state.username,
      password: this.state.password,
    };
    localStorage.setItem("username", this.state.username);
    this.props.loginUser(userData);
    console.log(userData);
  };
  render() {
    const { errors } = this.state;
    const style = { color: "black", fontSize: "1.5em", margin: "1em" }
    return (
      <div className="loginBody">
      <div className="screen-1">
        <h1 style={{ color: "black" }} align="middle">
          Login form
        </h1>
        <form align="middle" onSubmit={this.onSubmit}>
          
        <div className="username"> 
        <div className="sec-2">
        <FaUserCircle  style={style}/>
          <label>Username: </label>
          <input
            id="username"
            type="text"
            onChange={this.onChange}
            value={this.state.username}
            error={errors.username}
            className={classnames("", {
              invalid: errors.username || errors.userNotFound,
            })}
          ></input>
          <span style={{color: "red"}} className="red-text">
            {errors.username}
            {errors.userNotFound}
          </span>
          </div>
          </div>

          <br />
          <br />

          <div className="password">
            <div className="sec-2">
          <RiLockPasswordFill style={style}/>
          <label>Password: </label>
          <input
            id="password"
            type="password"
            onChange={this.onChange}
            value={this.state.password}
            error={errors.password}
            className={classnames("", {
              invalid: errors.password || errors.passwordIncorrect,
            })}
          ></input>
          <span style={{color: "red"}} className="red-text">
            {errors.password}
            {errors.passwordIncorrect}
          </span>
          </div>
          </div>
          <br />
          <br />
          <input type="submit" value="submit" className="login"></input>
        </form>
        <Link to="/register">
          Don't have an account? Sign Up
        </Link>
        <br/>
      </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(Login);