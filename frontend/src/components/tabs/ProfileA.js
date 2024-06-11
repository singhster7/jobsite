import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import CreatableSelect from "react-select/creatable";
import { saveUser } from "../../utils/saveUser";
import axios from "axios";
import "./../../index.css";
import profile from "./../../profile.png";
import Button from "@material-ui/core/Button";

let skills = [
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
export class ProfileA extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
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
      disabled: true,
      role: "",
    };
  }
  componentDidMount() {
    this._isMounted = true;

    const data = this.props.user;
    data.userId = data._id;
    console.log(data);
    axios
      .post("https://jobsgram.herokuapp.com/api/applicant", data)
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            id: res.data._id,
            name: res.data.name ? res.data.name : "",
            email: res.data.email ? res.data.email : "",
            number: res.data.number ? res.data.number : "",
            education: res.data.education ? res.data.education : [{}],
            skills: res.data.skills ? res.data.skills : [{}],
            role: data.role ? data.role : "",
            resumeName: res.data.resumeName ? res.data.resumeName : "",
            imageName: res.data.imageName ? res.data.imageName : "",
          });
          if (res.data.imageName) {
            const data2 = {
              filename: res.data.imageName,
              user: res.data._id,
            };
            axios
              .post("https://jobsgram.herokuapp.com/download", data2, {
                responseType: "blob",
              })
              .then((response) => {
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                document.querySelector("#profilePic").src = url;
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => console.log(err));
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
            style={{ margin: "2px 0" }}
            key={i}
          >
            <span style={sty}>Institution Name</span>
            <input
              type="text"
              disabled={this.state.disabled}
              value={el.institutionName || ""}
              id="institutionName"
              className={classnames("", {
                invalid: errors.education[i]
                  ? errors.education[i].institutionName
                  : null,
              })}
              onChange={this.handleChange.bind(this, i)}
            />
            <span className="red-text">
              {errors.education[i] ? errors.education[i].institutionName : null}
            </span>
          </div>
        </div>
        <div className="row" style={{ marginBottom: "0px" }}>
          <div className="input-field col s4" style={{ margin: "2px 0" }}>
            <span style={sty}>Start Year</span>
            <input
              type="number"
              disabled={this.state.disabled}
              value={el.startYear || ""}
              id="startYear"
              onChange={this.handleChange.bind(this, i)}
              className={classnames("", {
                invalid: errors.education[i]
                  ? errors.education[i].startYear
                  : null,
              })}
            />
            <span className="red-text">
              {errors.education[i] ? errors.education[i].startYear : null}
            </span>
          </div>
          <div
            className="input-field col s4 offset-s1"
            style={{ margin: "2px 0" }}
          >
            <span style={sty}>End Year</span>
            <input
              type="number"
              disabled={this.state.disabled}
              value={el.endYear || ""}
              id="endYear"
              onChange={this.handleChange.bind(this, i)}
              className={classnames("", {
                invalid: errors.education[i]
                  ? errors.education[i].endYear
                  : null,
              })}
            />
            <span className="red-text">
              {errors.education[i] ? errors.education[i].endYear : null}
            </span>
          </div>
          <div className="col s3 valign-wrapper" style={{ height: "79px" }}>
            {this.state.disabled ? null : (
              <input
                type="button"
                className="btn btn-small"
                style={{ backgroundColor: "red", margin: "0 auto" }}
                value="X"
                onClick={this.removeClick.bind(this, i)}
              />
            )}
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

  download = (type) => {
    let filename;
    if (type === "resume") {
      filename = this.state.resumeName;
    } else if (type === "image") {
      filename = this.state.imageName;
    }
    if (filename === "") {
      alert("File not uploaded");
      return;
    }
    const data = {
      filename: filename,
      user: this.state.id,
    };
    axios
      .post("https://jobsgram.herokuapp.com/download", data, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  uploadFile = (e) => {
    let file = e.target.files[0];
    if (e.target.name === "resume" && file.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }
    if (
      e.target.name === "image" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/png"
    ) {
      alert("Only png and jpeg allowed");
      return;
    }
    let data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("user", this.state.id);
    data.append("type", e.target.name);
    axios
      .post("https://jobsgram.herokuapp.com/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (e.target.name === "resume") {
          this.setState({ resumeName: res.data.resumeName });
        } else if (e.target.name === "image") {
          this.setState({ imageName: res.data.imageName });
          const url = window.URL.createObjectURL(e.target.files[0]);
          document.querySelector("#profilePic").src = url;
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
        education: this.state.education,
        skills: this.state.skills,
        role: this.state.role,
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
              <div
                class="col s12 center-align"
                style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}
              >
                <img
                  src={profile}
                  style={{ height: "10rem", width: "10rem" }}
                  alt=""
                  id="profilePic"
                  class="circle responsive-img"
                />
              </div>
              <div
                class="col s12 center-align"
                style={{ marginBottom: "0.5rem" }}
              >
                <Button component="label" variant="contained" color="primary">
                  <input
                    hidden
                    name="image"
                    type="file"
                    onChange={(e) => (e.target ? this.uploadFile(e) : null)}
                  />
                  Change DP
                </Button>
              </div>
              <form onSubmit={this.onSubmit}>
                <div
                  className="input-field col s12"
                  style={{ margin: "2px 0" }}
                >
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
                <div
                  className="input-field col s12"
                  style={{ margin: "2px 0" }}
                >
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
                <div
                  className="input-field col s12"
                  style={{ margin: "2px 0" }}
                >
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
                    {this.state.disabled ? null : (
                      <input
                        className="btn btn-small"
                        disabled={this.state.disabled}
                        type="button"
                        value="add more"
                        onClick={this.addClick.bind(this)}
                      />
                    )}
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
                  <div
                    className="col s11 offset-s1"
                    style={{ marginBottom: "1rem" }}
                  >
                    {this.state.skills.map((skill, index) => (
                      <span key={index}>
                        <span
                          className="white-text"
                          style={{
                            backgroundColor: "#5c74ec",
                            borderRadius: "3px",
                            margin: "2rem 0",
                            padding: "0.4rem",
                          }}
                        >
                          {skill}
                        </span>
                        <span> </span>
                      </span>
                    ))}
                  </div>
                  <div className="col s11 offset-s1">
                    <CreatableSelect
                      isMulti
                      isDisabled={this.state.disabled}
                      closeMenuOnSelect={false}
                      onChange={this.onChangeSkill}
                      options={skills}
                      styles={{
                        menu: (base) => ({ ...base, position: "relative" }),
                      }}
                    />
                  </div>
                </div>
                <div
                  className="col s1"
                  style={{ marginLeft: "10px", fontSize: "16px" }}
                  className="black-text"
                >
                  Resume:
                </div>
                <div
                  className="col s11 offset-s1 center-align"
                  style={{ marginBottom: "2rem" }}
                >
                  <Button component="label" variant="contained" color="primary">
                    <input
                      hidden
                      name="resume"
                      type="file"
                      onChange={(e) => (e.target ? this.uploadFile(e) : null)}
                    />
                    <i className="material-icons">arrow_upward</i>
                    Upload Resume
                  </Button>
                  <Button
                    style={{ marginLeft: "2rem" }}
                    color="primary"
                    className="btn btn-small"
                    onClick={(e) => {
                      this.download("resume");
                    }}
                  >
                    <i className="material-icons">arrow_downward</i>
                    Resume
                  </Button>
                </div>
                <div className="col s12">
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

export default connect(mapStateToProps)(withRouter(ProfileA));
