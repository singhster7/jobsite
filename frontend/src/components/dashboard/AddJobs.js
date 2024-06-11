import React, { useState } from "react";
import classnames from "classnames";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import "./../../index.css";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export default function AddJobs(props) {
  const [errors, setErrors] = useState({});
  const [job, setJob] = useState({
    title: "",
    typeOfJob: "",
    duration: "0",
    applications: "",
    positions: "",
    salary: "",
    skills: "",
    deadline: "2000-01-01T00:00",
  });
  const classes = useStyles();

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var date = new Date();
    var dated = new Date(job.deadline);
    if (date > dated) {
      formIsValid = false;
      errors.deadline = "Deadline already passed";
    }
    if (job.title === "") {
      formIsValid = false;
      errors.title = "Job title is required";
    }
    if (job.applications === "") {
      formIsValid = false;
      errors.applications = "No. of applications is required";
    }
    if (job.applications === "0") {
      formIsValid = false;
      errors.applications = "No. of applications cant be 0";
    }
    if (job.applications < 0) {
      formIsValid = false;
      errors.applications = "No. of applications cant be negative";
    }
    if (!job.applications.toString().match(/^[0-9]+$/)) {
      formIsValid = false;
      errors.applications = "Job applications can only be numnerical";
    }
    if (job.positions === "") {
      formIsValid = false;
      errors.positions = "No. of positions is required";
    }
    if (job.positions === "0") {
      formIsValid = false;
      errors.positions = "No. of positions cant be 0";
    }
    if (job.positions < 0) {
      formIsValid = false;
      errors.positions = "No. of positions cant be negative";
    }
    if (!job.positions.toString().match(/^[0-9]+$/)) {
      formIsValid = false;
      errors.positions = "Job positions can only be numnerical";
    }
    if (parseInt(job.positions) > parseInt(job.applications)) {
      formIsValid = false;
      errors.positions =
        "No. of positions cant be more than no. of applications";
    }
    if (job.deadline > Date.now) {
      formIsValid = false;
      errors.deadline = "Deadline already passed";
    }
    if (job.typeOfJob === "") {
      formIsValid = false;
      errors.typeOfJob = "Please select a Job Type";
    }
    if (job.salary === "") {
      formIsValid = false;
      errors.salary = "Job salary is required";
    }
    if (!job.salary.toString().match(/^[0-9]+$/)) {
      formIsValid = false;
      errors.salary = "Job salary can only be numnerical";
    }
    if (job.salary === "0") {
      formIsValid = false;
      errors.salary = "Job salary cant be 0";
    }
    if (job.salary < 0) {
      formIsValid = false;
      errors.salary = "Salary of job cannot be negative";
    }
    if (job.skills === "") {
      formIsValid = false;
      errors.skills = "Skills cannot be empty";
    }
    setErrors(errors);
    return formIsValid;
  };

  const onChange = (e) => {
    if (
      e.target.parentElement &&
      e.target.parentElement.parentElement.id === "typeOfJob"
    ) {
      setJob({
        ...job,
        [e.target.parentElement.parentElement.id]: e.target.value,
      });
    } else {
      setJob({ ...job, [e.target.id]: e.target.value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      var dated = new Date(job.deadline);
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const newJob = {
        title: job.title,
        recruiterName: props.user.name ? props.user.name : "",
        applications: job.applications,
        positions: job.positions,
        deadline: dated,
        dateOfPosting: date,
        skills: job.skills,
        salary: job.salary,
        duration: job.duration,
        typeOfJob: job.typeOfJob,
        userId: props.user._id,
      };
      axios
        .post("https://jobsgram.herokuapp.com/api/jobs/add", newJob)
        .then((res) => {
          window.M.toast({ html: "Job Added!" }, 2000);
          setJob({
            title: "",
            typeOfJob: "",
            duration: "0",
            applications: "",
            positions: "",
            salary: "",
            skills: "",
            deadline: "2000-01-01T00:00",
          });
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="container z-depth-2" style={{ margin: "2rem auto" }}>
      <div className="row">
        <div className="col s10 offset-s1">
          <h4 className="grey-text text-darken-4 header left-align ">
            <b>Add Jobs</b>
          </h4>
          <form onSubmit={onSubmit}>
            <div className="input-field col s12">
              <input
                value={job.title}
                onChange={onChange}
                error={errors.title}
                id="title"
                type="text"
                className={classnames("", {
                  invalid: errors.title,
                })}
              />
              <span className="red-text">{errors.title}</span>
              <label htmlFor="title">Job Title</label>
            </div>
            <div className="col s5 input-field" style={{ marginTop: "0" }}>
              <input
                value={job.applications}
                onChange={onChange}
                error={errors.applications}
                id="applications"
                type="number"
                className={classnames("", {
                  invalid: errors.applications,
                })}
              />
              <span className="red-text">{errors.applications}</span>
              <label htmlFor="applications">Max. Applications</label>
            </div>
            <div
              className="col s5 offset-s2 input-field"
              style={{ marginTop: "0" }}
            >
              <input
                value={job.positions}
                onChange={onChange}
                error={errors.positions}
                id="positions"
                type="number"
                className={classnames("", {
                  invalid: errors.positions,
                })}
              />
              <span className="red-text">{errors.positions}</span>
              <label htmlFor="positions">Max. Positions</label>
            </div>
            <div
              className="col s5"
              style={{ padding: "0 1.75rem 1rem 0.75rem" }}
            >
              <TextField
                id="deadline"
                onChange={onChange}
                label="Deadline for Application"
                value={job.deadline}
                type="datetime-local"
                className="browser-default"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ marginBottom: "0.25rem" }}
              />
              <span className="red-text">{errors.deadline}</span>
            </div>
            <div className="input-field col s12">
              <input
                value={job.skills}
                onChange={onChange}
                error={errors.skills}
                id="skills"
                type="text"
                className={classnames("", {
                  invalid: errors.skills,
                })}
              />
              <span className="red-text">{errors.skills}</span>
              <label htmlFor="skills">Required Skills</label>
            </div>
            <div
              className="row"
              style={{ marginBottom: "0", paddingLeft: "0.9rem" }}
            >
              <div className="col s6 input-field">
                <input
                  value={job.salary}
                  onChange={onChange}
                  error={errors.salary}
                  id="salary"
                  type="number"
                  className={classnames("", {
                    invalid: errors.salary,
                  })}
                />
                <span className="red-text">{errors.salary}</span>
                <label htmlFor="salary">Salary in Rs/- Month</label>
              </div>
              <div
                className="input-field col s1 valign-wrapper"
                style={{ height: "3rem" }}
              >
                <div className="grey-text text-darken-3 ">Duration:</div>
              </div>
              <div className="input-field col s4 offset-s1">
                <FormControl className={classes.formControl}>
                  <Select
                    id="duration"
                    value={job.duration ? job.duration : "7"}
                    onChange={(event) => {
                      setJob({ ...job, duration: event.target.value });
                    }}
                  >
                    <MenuItem value="0">Indefinite</MenuItem>
                    <MenuItem value="1">1 month</MenuItem>
                    <MenuItem value="2">2 months</MenuItem>
                    <MenuItem value="3">3 months</MenuItem>
                    <MenuItem value="4">4 months</MenuItem>
                    <MenuItem value="5">5 months</MenuItem>
                    <MenuItem value="6">6 months</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="center-align">
              <fieldset
                id="typeOfJob"
                onChange={onChange}
                value=" "
                className={classnames("", { invalid: errors.typeOfJob })}
                style={{
                  border: 0,
                  display: "inline-block",
                  paddingBottom: "0",
                }}
              >
                <span className="grey-text text-darken-3 left-align  ">
                  Type of Job:
                </span>
                <label style={{ padding: "0px 1.25rem 0px 2.5rem" }}>
                  <input
                    className="with-gap"
                    name="type"
                    type="radio"
                    value="Full-Time"
                  />
                  <span className="grey-text text-darken-3">Full-Time</span>
                </label>
                <label style={{ paddingRight: "1.25rem" }}>
                  <input
                    className="with-gap"
                    name="type"
                    type="radio"
                    value="Part-Time"
                  />
                  <span className="grey-text text-darken-3">Part-Time</span>
                </label>
                <label>
                  <input
                    className="with-gap"
                    name="type"
                    type="radio"
                    value="Work from Home"
                  />
                  <span className="grey-text text-darken-3">
                    Work from Home
                  </span>
                </label>
              </fieldset>
            </div>
            <span style={{ paddingLeft: "15rem" }} className="red-text">
              {errors.typeOfJob}
            </span>
            <div className="col s10" style={{ paddingBottom: "1rem" }}>
              <button
                style={{
                  width: "100px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  margin: "1rem  0",
                }}
                type="submit"
                className="btn btn-large"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
