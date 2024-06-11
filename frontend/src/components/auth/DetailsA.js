import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import Navbar from "./../layout/Navbar";
import "./../../index.css";
import { saveUser } from "../../utils/saveUser";
import CreatableSelect from "react-select/creatable";

const skills = [
  { value: "C", label: "C" },
  { value: "C++", label: "C++" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "HTML/CSS", label: "HTML/CSS" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "React", label: "React" },
  { value: "Flask", label: "Flask" },
  { value: "Flutter", label: "Flutter" },
  { value: "React", label: "React" },
  { value: "Python", label: "Python" },
];

class DetailsA extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      number: "",
      education: [
        {
          institutionName: "",
          startYear: "",
          endYear: "",
        },
      ],
      skills: [],
      errors: {
        education: [{}],
      },
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
    let errors = {
      education: [],
    };
    for (let i = 0; i < this.state.education.length; i++) {
      errors.education.push({});
    }
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
    //education
    for (let i = 0; i < this.state.education.length; i++) {
      if (this.state.education[i].institutionName === "") {
        formIsValid = false;
        errors.education[i].institutionName = "Insitution Name cannot be empty";
      }
      if (this.state.education[i].startYear === "") {
        formIsValid = false;
        errors.education[i].startYear = "Start Year cannot be empty";
      }
      if (
        this.state.education[i].startYear < 1900 ||
        this.state.education[i].startYear > 2020
      ) {
        formIsValid = false;
        errors.education[i].startYear = "Invalid Year";
      }
      if (
        (this.state.education[i].endYear < 1900 ||
          this.state.education[i].endYear > 3020) &&
        !this.state.education[i].endYear === ""
      ) {
        formIsValid = false;
        errors.education[i].endYear = "Invalid Year";
      }
      if (
        this.state.education[i].startYear > this.state.education[i].endYear &&
        !this.state.education[i].endYear === ""
      ) {
        formIsValid = false;
        errors.education[i].endYear = "End Year cannot be less than Start Year";
      }
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createUI() {
    const { errors } = this.state;
    return this.state.education.map((el, i) => (
      <React.Fragment key={i}>
        <div className="row" style={{ marginBottom: "0px" }}>
          <div
            className="input-field col s12"
            style={{ margin: "7px 0" }}
            key={i}
          >
            <input
              type="text"
              value={el.institutionName || ""}
              id="institutionName"
              className={classnames("", {
                invalid: errors.education
                  ? errors.education[i].institutionName
                  : null,
              })}
              onChange={this.handleChange.bind(this, i)}
            />
            <label htmlFor="institutionName">Institution Name</label>
            <span className="red-text">
              {errors.education ? errors.education[i].institutionName : null}
            </span>
          </div>
        </div>
        <div className="row" style={{ marginBottom: "0px" }}>
          <div className="input-field col s4">
            <input
              type="number"
              value={el.startYear || ""}
              id="startYear"
              onChange={this.handleChange.bind(this, i)}
              className={classnames("", {
                invalid: errors.education
                  ? errors.education[i].startYear
                  : null,
              })}
            />
            <label htmlFor="startYear">Start Year</label>
            <span className="red-text">
              {errors.education ? errors.education[i].startYear : null}
            </span>
          </div>
          <div className="input-field col s4 offset-s1">
            <input
              type="number"
              value={el.endYear || ""}
              id="endYear"
              onChange={this.handleChange.bind(this, i)}
              className={classnames("", {
                invalid: errors.education ? errors.education[i].endYear : null,
              })}
            />
            <label htmlFor="endYear">End Year</label>
            <span className="red-text">
              {errors.education ? errors.education[i].endYear : null}
            </span>
          </div>
          <div className="col s3 valign-wrapper" style={{ height: "79px" }}>
            <input
              type="button"
              className="btn btn-small"
              style={{ backgroundColor: "red", margin: "0 auto" }}
              value="X"
              onClick={this.removeClick.bind(this, i)}
            />
          </div>
        </div>
      </React.Fragment>
    ));
  }
  handleChange(i, event) {
    let education = [...this.state.education];
    education[i][event.target.id] = event.target.value;
    this.setState({ education: education });
  }
  addClick() {
    this.setState((prevState) => ({
      education: [
        ...prevState.education,
        {
          institutionName: "",
          startYear: "",
          endYear: "",
        },
      ],
    }));
    this.setState((prevState) => ({
      errors: {
        ...prevState.errors,
        education: [...prevState.errors.education, {}],
      },
    }));
  }
  removeClick(i) {
    let education = [...this.state.education];
    education.splice(i, 1);
    this.setState({ education });
    let educatione = [...this.state.errors.education];
    educatione.splice(i, 1);
    this.setState((prevState) => ({
      errors: { ...prevState.errors, education: educatione },
    }));
  }

  onChangeSkill = (newValue: any, actionMeta: any) => {
    this.setState({
      skills: newValue ? newValue.map((newValue) => newValue.value) : [],
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      const userData = {
        id: this.props.location.state.detail[0].userId,
        name: this.state.name,
        email: this.state.email,
        number: this.state.number,
        education: this.state.education,
        skills: this.state.skills,
        role: this.props.location.state.detail[0].role,
      };
      saveUser(userData);
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
                <span
                  style={{ marginLeft: "10px", fontSize: "16px" }}
                  className="black-text"
                >
                  Education:
                </span>
                <br />
                <div className="row">
                  <div
                    className="col s10 offset-s2"
                    style={{ paddingTop: "10px" }}
                  >
                    {this.createUI()}
                    <input
                      className="btn btn-small"
                      type="button"
                      value="add more"
                      onClick={this.addClick.bind(this)}
                    />
                  </div>
                </div>
                <span
                  style={{ marginLeft: "10px", fontSize: "16px" }}
                  className="black-text"
                >
                  Skills:
                </span>
                <br />
                <div className="row" style={{ padding: "10px 0px" }}>
                  <div className="col s11 offset-s1">
                    <CreatableSelect
                      isMulti
                      closeMenuOnSelect={false}
                      onChange={this.onChangeSkill}
                      options={skills}
                      styles={{
                        menu: (base) => ({ ...base, position: "relative" }),
                      }}
                    />
                  </div>
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

DetailsA.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(withRouter(DetailsA));
