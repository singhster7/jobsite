import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import Navbar from "./../layout/Navbar";
import "./../../index.css";
import { saveUser } from "../../utils/saveUser";

class DetailsR extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      number: "",
      bio: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Name
    if (this.state.name === "") {
      formIsValid = false;
      errors["name"] = "Name cannot be empty";
    }
    //Email
    if (this.state.email === "") {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
    }
    if (typeof this.state.email !== "undefined") {
      let lastAtPos = this.state.email.lastIndexOf("@");
      let lastDotPos = this.state.email.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          this.state.email.indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          this.state.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }
    //number
    if (!this.state.number.toString().match(/^[0-9]+$/)) {
      formIsValid = false;
      errors["number"] = "Phone Number can only be numnerical";
    }
    if (this.state.number === "") {
      formIsValid = false;
      errors["number"] = "Phone Number cannot be empty";
    }
    if (parseInt(this.state.number) <= 0) {
      formIsValid = false;
      errors["number"] = "Phone Number cannot be negative";
    }
    if (
      (this.state.number.length < 10 || this.state.number.length > 11) &&
      this.state.number.length !== 0
    ) {
      formIsValid = false;
      errors["number"] = "Invalid Phone Number";
    }
    //bio
    if (this.state.bio === "") {
      formIsValid = false;
      errors["bio"] = "Bio cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      const userData = {
        id: this.props.location.state.detail[0].userId,
        name: this.state.name,
        email: this.state.email,
        number: this.state.number,
        bio: this.state.bio,
        role: this.props.location.state.detail[0].role,
      };
      saveUser(userData);
      console.log(userData);
      this.props.loginUser(this.props.location.state.detail[1]);
    }
  };

  render() {
    const { errors } = this.state;
    return (
      <React.Fragment>
        <Navbar />
        <div className="container valign-wrapper">
          <div
            className="row"
            style={{ margin: "30px 0px 30px 0px", width: "100%" }}
          >
            <div className="col s8 offset-s2">
              <div className="col s12">
                <h4>
                  <b>Enter Details</b>
                </h4>
              </div>
              <form onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    id="name"
                    type="text"
                    className={classnames("", {
                      invalid: errors.name,
                    })}
                  />
                  <label htmlFor="name">Name</label>
                  <span className="red-text">{errors.name}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="text"
                    className={classnames("", {
                      invalid: errors.email,
                    })}
                  />
                  <label htmlFor="email">E-mail</label>
                  <span className="red-text">{errors.email}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.number}
                    error={errors.number}
                    id="number"
                    type="number"
                    className={classnames("", {
                      invalid: errors.number,
                    })}
                  />
                  <label htmlFor="number">Phone Number</label>
                  <span className="red-text">{errors.number}</span>
                </div>
                <div className="input-field col s12">
                  <textarea
                    onChange={this.onChange}
                    value={this.state.bio}
                    error={errors.bio}
                    id="bio"
                    type="text"
                    className={classnames({
                      "materialize-textarea": true,
                      invalid: errors.bio,
                    })}
                    maxLength="250"
                  />
                  <label htmlFor="number">Bio (250 char max)</label>
                  <span className="red-text">{errors.bio}</span>
                </div>
                <div className="col s12">
                  <button
                    style={{
                      width: "100px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "10px",
                    }}
                    type="submit"
                    className="btn btn-medium waves-effect waves-light hoverable button"
                  >
                    Submit
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

DetailsR.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(withRouter(DetailsR));
