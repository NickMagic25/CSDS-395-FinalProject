import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
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
    return (
      <div className="registerContainer">
        <Link to="/dashboard" className="btn-flat waves-effect">
          Already have an account? Sign in
        </Link>
        <h1 style={{ color: "#A6CEB6" }} align="middle">
          Sign Up
        </h1>
        <form align="middle" onSubmit={this.onSubmit}>
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
          <span className="red-text">{errors.firstName}</span>
          <br />
          <br />

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
          <span className="red-text">{errors.lastName}</span>
          <br />
          <br />

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
          <span className="red-text">{errors.email}</span>
          <br />
          <br />
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
          <span className="red-text">{errors.username}</span>
          <br />
          <br />
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
          <span className="red-text">{errors.password}</span>
          <br />
          <br />
          <input type="submit" value="enter"></input>
        </form>
        <Link to="/login" className="btn-flat waves-effect">
          Already have an account? Sign in
        </Link>
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