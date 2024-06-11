import React, { Component } from "react";
import { Link , withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import Navbar from "./../layout/Navbar";
import './../../index.css';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      password2: "",
      role: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
onChange = e => {
  if(e.target.parentElement.parentElement.id === 'role'){
    this.setState({ [e.target.parentElement.parentElement.id]: e.target.value });
  } else {
    this.setState({ [e.target.id]: e.target.value });
  }
  };
onSubmit = e => {
    e.preventDefault();
const newUser = {
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2,
      role: this.state.role
    };
  this.props.registerUser(newUser, this.props.history); 

  };

render() {
    const { errors } = this.state;
return (
      <React.Fragment>
        <Navbar/>
        <div style={{ height: "90vh" }} className="container valign-wrapper z-depth-2">
          <div className="row">
            <div className="col s8 offset-s2">
              <div className="col s12">
                <h4>
                  <b>Register</b>
                </h4>
                <p className="grey-text">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
              <p className="grey-text text-darken-2" style={{ paddingLeft: "8px" }}>Type:</p>
              <fieldset id="role" onChange={this.onChange.bind(this)} className={classnames("", {invalid: errors.role})}  style={{border: 0 }}>
                  <label style={{ paddingRight: "20px" }}> 
                    <input 
                      className="with-gap" 
                      name="role" 
                      type="radio" 
                      value='applicants'
                    />
                    <span className="grey-text text-darken-2">Applicant</span>
                  </label>
                  <label>
                    <input 
                      className="with-gap" 
                      name="role" 
                      type="radio" 
                      value='recruiters'
                    />
                    <span className="grey-text text-darken-2">Recruiter</span>
                  </label>
                </fieldset>
                {errors.role ? <span style={{paddingLeft: "1rem" }} className="red-text">{errors.role}</span> : null} 
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.username}
                    error={errors.username}
                    id="username"
                    type="text"
                    className={classnames("", {
                      invalid: errors.username
                    })}
                  />
                  <label htmlFor="username">Username</label>
                  <span className="red-text">{errors.username}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className={classnames("", {
                      invalid: errors.password
                    })}
                  />
                  <label htmlFor="password">Password</label>
                  <span className="red-text">{errors.password}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                    className={classnames("", {
                      invalid: errors.password2
                    })}
                  />
                  <label htmlFor="password2">Confirm Password</label>
                  <span className="red-text">{errors.password2}</span>
                </div>
                <div className="col s12">
                  <button
                    style={{
                      width: "150px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem"
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable button"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));