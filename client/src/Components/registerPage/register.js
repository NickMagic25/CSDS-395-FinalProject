import "./register.css";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import {FaUserCircle} from 'react-icons/fa';
import {RiLockPasswordFill} from "react-icons/ri";
import {MdEmail} from "react-icons/md";
 
class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      errors: {},
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
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
    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };
    this.props.registerUser(newUser, this.props.history);
  };
  render() {
    const { errors } = this.state;
    const style = { color: "black", fontSize: "1.5em", margin: "1em" }
    const emailStyle = { color: "black", fontSize: "1.5em", margin: "1em", "margin-left" :"0em"}
    const nameStyle = { color: "white", fontSize: "1.5em", margin: "1em" }
    return (
      <div className="registerBody">
      <div className="screen-1">
        <h1 style={{ color: "black" }} align="middle">
          Sign Up
        </h1>
        <form align="middle" onSubmit={this.onSubmit}>
        <div className="username"> 
        <div className="sec-2">
        <FaUserCircle  style={nameStyle}/>
        <label>First Name: </label>
          <input
            id="firstName"
            type="text"
            onChange={this.onChange}
            value={this.state.firstName}
            error={errors.firstName}
            className={classnames("", {
              invalid: errors.firstName,
            })}
          ></input>
          <span style={{color: "red"}} className="red-text">{errors.firstName}</span>
          </div>
          </div>
          <br />
          <br />

          <div className="username"> 
          <div className="sec-2">
          <FaUserCircle  style={nameStyle}/>
          <label>Last Name: </label>
          <input
            id="lastName"
            type="text"
            onChange={this.onChange}
            value={this.state.lastName}
            error={errors.lastName}
            className={classnames("", {
              invalid: errors.lastName,
            })}
          ></input>
          <span style={{color: "red"}} className="red-text">{errors.lastName}</span>
          </div>
          </div>
          <br />
          <br />

          <div className="username"> 
          <div className="sec-2">
            <MdEmail style={emailStyle}/>
          <label>Email: </label>
          <input
            onChange={this.onChange}
            value={this.state.email}
            error={errors.email}
            id="email"
            type="email"
            className={classnames("", {
              invalid: errors.email,
            })}
          ></input>
          <span style={{color: "red"}} className="red-text">{errors.email}</span>
          </div>
          </div>
          <br />
          <br />

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
              invalid: errors.username,
            })}
          ></input>
          <span style={{color: "red"}} className="red-text">{errors.username}</span>
          </div>
          </div>
          <br />
          <br />

          <div className="username"> 
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
              invalid: errors.password,
            })}
          ></input>
          <span style={{color: "red"}} className="red-text">{errors.password}</span>
          </div>
          </div>
          <br />
          <br />
          <input type="submit" value="submit"  className="login"></input>
        </form>
        <Link to="/login" className="btn-flat waves-effect">
          Already have an account? Sign in
        </Link>
      </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

//connects to the router established in App.js
export default connect(mapStateToProps, { registerUser })(withRouter(Register));