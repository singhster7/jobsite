import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./../../index.css";
import { saveUser } from "../../utils/saveUser";
import classnames from "classnames";
import axios from "axios";

export class ProfileR extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      number: "",
      bio: "",
      errors: {},
      disabled: true,
    };
  }

  componentDidMount() {
    const data = this.props.user;
    data.userId = data._id;
    axios
      .post("https://jobsgram.herokuapp.com/api/recruiter", data)
      .then((res) =>
        this.setState({
          id: res.data._id,
          name: res.data.name ? res.data.name : "",
          email: res.data.email ? res.data.email : "",
          number: res.data.number ? res.data.number : "",
          bio: res.data.bio ? res.data.bio : "",
        })
      )
      .catch((err) => console.log(err));
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
      this.state.number.length !== "0"
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
      this.setState((prevState) => ({ disabled: !prevState.disabled }));
      const userData = {
        id: this.state.id,
        name: this.state.name,
        email: this.state.email,
        number: this.state.number,
        bio: this.state.bio,
      };
      if (this.state.disabled === false) {
        saveUser(userData).then(() =>
          window.M.toast({ html: "Details Updated!" }, 2000)
        );
      }
    }
  };

  render() {
    const { errors } = this.state;
    return (
      <React.Fragment>
        <div className="container valign-wrapper">
          <div
            className="row"
            style={{ margin: "30px 0px 30px 0px", width: "100%" }}
          >
            <div className="col s10 offset-s1">
              <div className="col s12">
                <h4>
                  <b>Personal Details</b>
                </h4>
              </div>
              <form onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                  <span style={sty}>Name</span>
                  <input
                    onChange={this.onChange}
                    disabled={this.state.disabled}
                    value={this.state.name}
                    error={errors.name}
                    id="name"
                    type="text"
                    className={classnames("", {
                      invalid: errors.name,
                    })}
                  />
                  <span className="red-text">{errors.name}</span>
                </div>
                <div className="input-field col s12">
                  <span style={sty}>E-mail</span>
                  <input
                    onChange={this.onChange}
                    disabled={this.state.disabled}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="text"
                    className={classnames("", {
                      invalid: errors.email,
                    })}
                  />
                  <span className="red-text">{errors.email}</span>
                </div>
                <div className="input-field col s12">
                  <span style={sty}>Phone Number</span>
                  <input
                    onChange={this.onChange}
                    disabled={this.state.disabled}
                    value={this.state.number}
                    error={errors.number}
                    id="number"
                    type="number"
                    className={classnames("", {
                      invalid: errors.number,
                    })}
                  />
                  <span className="red-text">{errors.number}</span>
                </div>
                <div className="input-field col s12">
                  <span style={sty}>Bio(250 char max)</span>
                  <textarea
                    onChange={this.onChange}
                    disabled={this.state.disabled}
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
                  <span className="red-text">{errors.bio}</span>
                </div>
                <div className="row">
                  <div className="col s2">
                    <input
                      className="btn btn-large"
                      style={{
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "10px",
                      }}
                      type="submit"
                      value={this.state.disabled ? "Edit" : "Save"}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const sty = {
  fontSize: "13px",
  color: "#9e9e9e",
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(withRouter(ProfileR));
